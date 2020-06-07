import * as React from 'react';
import { Icon, Text } from 'office-ui-fabric-react';
import { IAdListCardProps, IAdItem } from '../../interfaces/Interfaces';
import { useState } from 'react';
import styles from '../../css/BlocketWannabe.module.scss';
import AdEditPanel from './AdEditPanel';
import { isUserAdCreator } from '../../helpers/authorizeHelper';
import { getFriendlyDateString } from '../../helpers/genericHelper';

export default function AdListCard({ ad, web, categories, onSubmit, context, isUserAdmin, onAdClick, currentUser, onDelete }: IAdListCardProps) {

  if (!ad) {
    return null;
  }

  const placeHolderImgPath = String(require('../../img/placeholder.jpg'));
  const [showEditPanel, setEditPanel] = useState(false);
  const image = { backgroundImage: `url('${ad.Attachments.length > 0 ? ad.Attachments[0].Url : placeHolderImgPath}')` }

  const handleEditSubmit = (ad: IAdItem): void => {
    onSubmit(ad);
    setEditPanel(false);
  };

  return (
    <>
      <AdEditPanel
        show={showEditPanel}
        onDismiss={() => setEditPanel(false)}
        ad={ad}
        web={web}
        categories={categories}
        onSubmit={handleEditSubmit}
        context={context}
        isUserAdmin={isUserAdmin} />
      <div className={styles.adCard} >
        <div className={styles.adCardImage} style={image} onClick={() => onAdClick(ad)}></div>
        <div className={styles.adCardContent}>
          <Text className={styles.adCardContentCategory}>
            {ad.Category.CategoryName}
          </Text>
          <Text className={styles.adCardContentTitle} onClick={() => onAdClick(ad)}>
            {ad.Title}
          </Text>
          <Text className={styles.adCardDefaultText}>
            {ad.Price} SEK
          </Text>
        </div>
        <div className={styles.adCardSection}>
          <Text className={styles.adCardDefaultText}>
            {getFriendlyDateString(ad.Date)}
          </Text>
          {
            isUserAdCreator(currentUser, ad.User) ? (
              <div className={styles.adCardSectionIcons}>
                <Icon iconName="Edit" onClick={() => setEditPanel(true)} />
                <Icon iconName="Delete" onClick={() => onDelete(ad.Id)} />
              </div>
            ) :
              (
                null
              )
          }
        </div>
      </div>
    </>
  );
}