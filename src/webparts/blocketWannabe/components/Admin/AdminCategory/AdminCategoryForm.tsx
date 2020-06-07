import * as React from 'react';
import { Label, TextField, PrimaryButton } from 'office-ui-fabric-react/lib/';
import { useState } from 'react';
import { IAdminView, ICategoryItem } from '../../../interfaces/Interfaces';

export default function AdminCategoryForm({ addCategory, categories }: IAdminView): React.ReactElement {

    const [categoryInput, setCategoryInput] = useState<string>('');
    const [isButtonDisabled, setButtonState] = useState<boolean>(true);

    const validateInput = (input: string): string => {

        const trimmedInput = input.trim();

        if (!trimmedInput || trimmedInput === '') {
            setButtonState(true);
            return 'The field cannot be empty.';
        }

        const isAlreadyTaken = categories.some((category: ICategoryItem) => category.CategoryName.toLowerCase() === trimmedInput.toLowerCase());

        if (isAlreadyTaken) {
            setButtonState(true);
            return 'This category name is already taken.'
        }

        setButtonState(false);
        return '';
    }

    return (
        <form>
            <Label required={true}>Category name</Label>
            <TextField
                value={categoryInput}
                onChanged={(value) => setCategoryInput(value)}
                onGetErrorMessage={validateInput}
                validateOnLoad={false} />
            <PrimaryButton
                text="Add category"
                onClick={() => addCategory(categoryInput)}
                disabled={isButtonDisabled}
            />
        </form>
    )
}