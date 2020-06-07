import * as React from 'react';
import { IAdViewProps } from '../../interfaces/Interfaces';
import styles from '../../css/BlocketWannabe.module.scss';
import { Text, Persona, PersonaSize, DefaultButton } from 'office-ui-fabric-react';
import { getFriendlyDateString } from '../../helpers/genericHelper';

export default function AdView({ ad, onDismiss }: IAdViewProps) {

    const placeHolderImgPath = String(require('../../img/placeholder.jpg'));
    const image = { backgroundImage: `url('${ad.Attachments.length > 0 ? ad.Attachments[0].Url : placeHolderImgPath}')` }

    return (
        <div className={styles.adViewContainer}>
            <div className={styles.adViewContainer__left}>
                <div className={styles.adHeader}>
                    <Text className={styles.adCategory}>{ad.Category.CategoryName}</Text>
                    <Text className={styles.adDate}>{getFriendlyDateString(ad.Date)}</Text>
                </div>
                <Text className={styles.adTitle}>{ad.Title}</Text>
                <Text variant="small">{ad.Description}</Text>
                <div className={styles.adFooter}>
                    <Text>{ad.Price} SEK</Text>
                    <Persona text={ad.User.FullName} size={PersonaSize.size24} />
                </div>
                <div className={styles.adViewButtons}>
                    <DefaultButton text="Back" onClick={onDismiss} />
                    <DefaultButton text="Buy" />
                </div>
            </div>
            <div className={styles.adViewContainer__right}>
                <div className={styles.adViewImage} style={image}></div>
            </div>
        </div>
    )
}