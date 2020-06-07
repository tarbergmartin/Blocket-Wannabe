import * as React from 'react';
import AdListCard from './AdListCard';
import { IADListProps } from '../../interfaces/Interfaces';
import { Spinner, SpinnerSize, Icon, Text } from 'office-ui-fabric-react';
import styles from '../../css/BlocketWannabe.module.scss';
import { useState } from 'react';
import NoResult from '../Shared/NoResult';

export default function AdList({ ads, web, categories, onSubmit, context, isUserAdmin, onAdClick, onSort, currentUser, onDelete }: IADListProps) {

    if (!ads) {
        return (
            <Spinner size={SpinnerSize.large} label="Please wait ..." />
        )
    }

    if (ads.length === 0) {
        return (
            <NoResult />
        )
    }

    const [isTitleSortAsc, setTitleSortOrder] = useState(true);
    const [isDateSortAsc, setDateSortOrder] = useState(true);

    const handleSortTitle = (): void => {
        onSort('Title', isTitleSortAsc);
        setTitleSortOrder(!isTitleSortAsc);
    };

    const handleSortDate = (): void => {
        onSort('Date', isDateSortAsc);
        setDateSortOrder(!isDateSortAsc);
    }

    return (
        <>
            <div className={styles.adSortContainer}>
                <div className={styles.adSortContainer__icon} onClick={handleSortTitle}>
                    <Text variant="small">Title</Text>
                    <Icon iconName="Sort" />
                </div>
                <div className={styles.adSortContainer__icon} onClick={handleSortDate}>
                    <Text variant="small">Date</Text>
                    <Icon iconName="Sort" />
                </div>
            </div>
            <div className={styles.adListContainer}>
                {
                    ads.map(ad =>
                        <AdListCard
                            ad={ad}
                            web={web}
                            categories={categories}
                            onSubmit={onSubmit}
                            context={context}
                            isUserAdmin={isUserAdmin}
                            onAdClick={onAdClick}
                            currentUser={currentUser}
                            onDelete={onDelete} />)
                }
            </div>
        </>
    )
}