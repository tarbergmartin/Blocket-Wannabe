import * as React from 'react';
import { IProps, IState, IAdItem } from '../interfaces/Interfaces';
import styles from '../css/BlocketWannabe.module.scss';
import { Pivot, PivotItem, PivotLinkSize, MessageBarType } from 'office-ui-fabric-react/lib/';
import { useState, useEffect } from 'react';
import { Web, sp } from '@pnp/sp';
import { getAllAds, getAllCategories, addNewCategory, addNewAd, updateExistingAd, filterAdsByQuery, removeAd, sortByPropName } from '../helpers/adHelper';
import { getCurrentUser } from '../helpers/authorizeHelper';
import AdForm from './Shared/AdForm';
import AdminView from './Admin/AdminView';
import AppMessage from './Shared/AppMessage';
import MainView from './MainView/MainView';
import { stringIsNullOrEmpty } from '@pnp/common';

export default function AdAppContainer(props: IProps): React.ReactElement {

  const [state, setState] = useState<IState>({
    web: new Web('https://nackademiskt.sharepoint.com/sites/apitestsite'),
    ads: null,
    visibleAds: null,
    categories: [],
    currentUser: null,
    pivotSelectionKey: '1',
    appMessage: null
  });

  const getData = async (): Promise<void> => {
   
   
    const web = await sp.web.get();
    const web2 = await state.web.get();
    console.log(web);
    console.log(web2);


    const [ads, categories, currentUser] = await Promise.all([
      getAllAds(state.web),
      getAllCategories(),
      getCurrentUser(state.web)
    ]);

    setState({ ...state, ads, categories, currentUser, visibleAds: ads });
  }

  useEffect(() => {
    getData();
  }, []);

  const insertCategory = async (categoryName: string): Promise<void> => {

    const category = await addNewCategory(categoryName);

    if (category) {
      setState({
        ...state,
        categories: [...state.categories, category],
        pivotSelectionKey: '1',
        appMessage: {
          message: 'You succesfully added a new category.',
          messageBarType: MessageBarType.success
        }
      });
    }
  };

  const insertAd = async (ad: IAdItem): Promise<void> => {

    const addedAd = await addNewAd(ad, state.web);

    if (addedAd) {

      const ads = await getAllAds(state.web);

      setState({
        ...state,
        ads: ads,
        visibleAds: ads,
        pivotSelectionKey: '1',
        appMessage: {
          message: 'You succesfully added an advertisement.',
          messageBarType: MessageBarType.success
        }
      });
    }
  };

  const updateAd = async (ad: IAdItem): Promise<void> => {

    const updatedAd = await updateExistingAd(ad, state.web);

    if (updatedAd) {

      const ads = await getAllAds(state.web);

      setState({
        ...state,
        ads: ads,
        visibleAds: ads,
        pivotSelectionKey: '1',
        appMessage: {
          message: 'You succesfully updated an advertisement.',
          messageBarType: MessageBarType.success
        }
      });
    }
  };

  const deleteAd = async (listId: number): Promise<void> => {

    const success = await removeAd(listId, state.web);

    if (success) {

      const ads = await getAllAds(state.web);

      setState({
        ...state,
        ads: ads,
        visibleAds: ads,
        pivotSelectionKey: '1',
        appMessage: {
          message: 'You succesfully removed an advertisement.',
          messageBarType: MessageBarType.success
        }
      })
    }
  };

  const searchAds = async (query: string): Promise<void> => {
    setState({
      ...state,
      visibleAds: !stringIsNullOrEmpty(query) ? filterAdsByQuery(query, state.ads) : state.ads
    });
  };

  const sortAds = (propName: string, isSortAsc: boolean): void => {
    setState({
      ...state,
      visibleAds: sortByPropName(state.visibleAds, propName, isSortAsc)
    });
  };

  return (
    <div className={styles.blocketWannabe}>
      <AppMessage
        appMessage={state.appMessage} />
      <div className={styles.container}>
        <div className={styles.row}>
          <Pivot
            linkSize={PivotLinkSize.large}
            selectedKey={state.pivotSelectionKey}
            onLinkClick={pivotItem => setState({ ...state, pivotSelectionKey: pivotItem.props.itemKey.toString() })}>
            <PivotItem itemKey="1" headerText="Ads" itemIcon="Document">
              <MainView
                ads={state.visibleAds}
                categories={state.categories}
                context={props.context}
                isUserAdmin={state.currentUser ? state.currentUser.isAdAdmin : false}
                web={state.web}
                onSubmit={updateAd}
                onSort={sortAds}
                onSearch={searchAds}
                currentUser={state.currentUser}
                onDelete={deleteAd} />
            </PivotItem>
            <PivotItem itemKey="2" headerText="New Ad" itemIcon="AddTo">
              <AdForm
                categories={state.categories}
                context={props.context}
                isUserAdmin={state.currentUser ? state.currentUser.isAdAdmin : false}
                web={state.web}
                onSubmit={insertAd}
                currentUser={state.currentUser} />
            </PivotItem>
            {
              state.currentUser && state.currentUser.isAdAdmin ?
                (
                  <PivotItem itemKey="3" headerText="Categories" itemIcon="MapLayers">
                    <AdminView
                      categories={state.categories}
                      addCategory={insertCategory} />
                  </PivotItem>
                ) :
                (
                  null
                )
            }
          </Pivot>
        </div>
      </div>
    </div>
  )
}
