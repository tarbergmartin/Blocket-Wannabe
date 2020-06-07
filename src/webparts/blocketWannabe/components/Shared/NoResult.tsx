import * as React from 'react';
import styles from '../../css/BlocketWannabe.module.scss';
import { Text } from 'office-ui-fabric-react';

export default function NoResult() {
    return (
        <div className={styles.noResultContainer}>
            <Text variant="large">No result were found. Please try again.</Text>
        </div>
    )
}