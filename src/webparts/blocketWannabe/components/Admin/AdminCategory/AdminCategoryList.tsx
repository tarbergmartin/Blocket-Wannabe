import * as React from 'react';
import { DetailsList, SelectionMode, IColumn } from 'office-ui-fabric-react/lib/';
import { IAdminView } from '../../../interfaces/Interfaces';
import { getCategoryListConfig } from '../../../helpers/adHelper';
export default function AdminCategoryList({ categories }: IAdminView): React.ReactElement {

    const columns: IColumn[] = getCategoryListConfig();

    return (
        <DetailsList items={categories} selectionMode={SelectionMode.none} columns={columns} />
    )
}