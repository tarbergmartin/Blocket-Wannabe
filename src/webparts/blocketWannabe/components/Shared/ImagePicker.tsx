import * as React from 'react';
import { useState } from 'react';
import styles from '../../css/BlocketWannabe.module.scss';
import { Label } from 'office-ui-fabric-react/lib/';
import { IImagePickerProps } from '../../interfaces/Interfaces';

export default function ImagePicker(props: IImagePickerProps): React.ReactElement {

    const placeHolderImgPath = String(require('../../img/placeholder.jpg'));
    const defaultImgPath = props.imagePath ? props.imagePath : placeHolderImgPath;
    const isRemoveVisibleOnLoad = props.imagePath ? true : false;
    
    const [imgPath, setImgPath] = useState(defaultImgPath);
    const [isRemoveVisible, setRemoveVisibility] = useState(isRemoveVisibleOnLoad);

    const onImageSelect = (changeEvent: React.ChangeEvent<HTMLInputElement>): void => {

        if (changeEvent.target.files && changeEvent.target.files[0]) {
   
            const reader = new FileReader();
            const image: File = changeEvent.target.files[0];

            reader.readAsDataURL(image);  
            reader.onload = (event: any) => {
                setImgPath(String(event.target.result))
                setRemoveVisibility(true);  
            };

            props.onImageSelected(image);
        }
    }

    const removeImage = (): void => {
        setRemoveVisibility(false);
        setImgPath(placeHolderImgPath);
        props.onRemove();
    }

    return (
        <div className={styles.imagePicker}>
            <div className={styles.imagePicker__labels}>
                <Label>Image</Label>
                {
                    isRemoveVisible ? <Label className={styles.removeLabel} onClick={removeImage}>✖</Label> : null
                }

            </div>
            <div className={styles.imagePicker__picker}>
                <label htmlFor="file-picker">
                    <img src={imgPath} />
                </label>
                <input
                    hidden={true}
                    type="file"
                    accept="image/*"
                    onChange={onImageSelect}
                    onClick={(event: any) => event.target.value = null}
                    id="file-picker" />
            </div>
        </div>
    )
}