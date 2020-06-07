import * as React from 'react';
import { IAdminView } from '../../interfaces/Interfaces';
import AdminCategoryList from './AdminCategory/AdminCategoryList';
import AdminCategoryForm from './AdminCategory/AdminCategoryForm';
import styles from '../../css/BlocketWannabe.module.scss';

export default function AdminView(props: IAdminView): React.ReactElement {
    return (
        <div className={styles.flexContainer}>
            <div className={styles.flexChild}>
                <AdminCategoryList 
                    categories={props.categories} />
            </div>
            <div className={styles.flexChild}>
                <AdminCategoryForm 
                    categories={props.categories} 
                    addCategory={props.addCategory} />
            </div>
        </div>
    )
}