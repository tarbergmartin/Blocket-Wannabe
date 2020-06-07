import * as React from 'react';
import AdList from './AdList';
import { IMainViewProps, IAdItem } from '../../interfaces/Interfaces';
import AdView from './AdView';
import { useState } from 'react';
import { SearchBox } from 'office-ui-fabric-react';
import styles from '../../css/BlocketWannabe.module.scss';

export default function MainView({ categories, ads, context, isUserAdmin, web, onSubmit, onSort, onSearch, currentUser, onDelete }: IMainViewProps) {

    const [isAdClicked, setAdClickState] = useState<boolean>(false);
    const [clickedAd, setClickedAd] = useState<IAdItem>(null);
    const [searchInut, setSearchInput] = useState<string>('');

    const handleSearch = (): void => {
        onSearch(searchInut);
        setSearchInput('');
    };

    const handleAdClick = (ad: IAdItem): void => {
        setClickedAd(ad);
        setAdClickState(true);
    };

    return (
        <>
            {
                isAdClicked ? (
                    <AdView
                        ad={clickedAd}
                        onDismiss={() => setAdClickState(false)} />
                ) :
                    (
                        <>
                            <SearchBox
                                className={styles.adSearchContainer}
                                placeholder="Search"
                                value={searchInut}
                                onChanged={(value) => setSearchInput(value)}
                                onSearch={handleSearch} />
                            <AdList
                                ads={ads}
                                categories={categories}
                                context={context}
                                isUserAdmin={isUserAdmin}
                                onSubmit={onSubmit}
                                web={web}
                                onAdClick={handleAdClick}
                                onSort={onSort}
                                onSearch={onSearch}
                                currentUser={currentUser}
                                onDelete={onDelete}/>
                        </>
                    )
            }
        </>
    )
}