import * as React from 'react';
import { TextField, Dropdown, PrimaryButton, IDropdownOption, DatePicker } from 'office-ui-fabric-react/lib/';
import { INewAdFormProps, INumValidationResult, ICategoryItem, IAdItem, IAttachment } from '../../interfaces/Interfaces';
import { useState, useEffect, } from 'react';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { validatePrice } from '../../helpers/validateHelper';
import { getUserByLoginName } from '../../helpers/authorizeHelper';
import { IODataUser } from '@microsoft/sp-odata-types';
import { getDefaultAd, getCategoryDropdownOptions, fileToAttachmentArray } from '../../helpers/adHelper';
import { accountForTimezone } from '../../helpers/genericHelper';
import ImagePicker from './ImagePicker';

export default function AdForm({ existingAd, categories, onSubmit, context, isUserAdmin, web, currentUser }: INewAdFormProps): React.ReactElement {

    const defaultAd: IAdItem = getDefaultAd(currentUser);
    const dropdownOptions = getCategoryDropdownOptions(categories);

    const [ad, setAd] = useState<IAdItem>(existingAd ? existingAd : defaultAd);
    const [isButtonDisabled, setButtonState] = useState<boolean>(true);

    if (!ad) {
        return null;
    }

    useEffect(() => {
        setButtonState(ad.Title.trim() == '' || ad.User.UserId == null || String(ad.Price) == '' || ad.Category == null);
    }, [ad.Price, ad.Title, ad.User, ad.Category]);

    const handleUserSelection = async (users: any[]) => {

        if (users.length > 0) {
            const user: IODataUser = await getUserByLoginName(users[0].id, web);
            setAd({
                ...ad, User: {
                    ...ad.User,
                    UserId: user.Id,
                    LoginName: user.LoginName,
                    Email: user.Email
                }
            });
        }

        else {
            setAd({ ...ad, User: { ...ad.User, UserId: null } })
        }
    };

    const handlePriceValidation = (input: string) => {
        const validationResult: INumValidationResult = validatePrice(Number(input), 1, 1000000);
        return validationResult.errorMessage;
    };

    const getTermCategory = (id: string): ICategoryItem => {
        return categories.filter(category => category.Id === id)[0];
    };

    const submitAd = (): void => {
        onSubmit(ad);
    };

    console.log(ad);

    return (
        <form>
            <TextField
                label="Title *"
                maxLength={30}
                value={ad.Title}
                onChanged={(value) => setAd({ ...ad, Title: value })} />
            <TextField
                label="Description"
                maxLength={250}
                multiline rows={10}
                value={ad.Description}
                onChanged={(value) => setAd({ ...ad, Description: value })} />
            <TextField
                label="Price *"
                suffix="SEK"
                type="number"
                value={String(ad.Price)}
                onChanged={(value) => setAd({ ...ad, Price: value })}
                onGetErrorMessage={handlePriceValidation}
                validateOnLoad={false} />
            <Dropdown
                label="Category *"
                options={dropdownOptions}
                selectedKey={ad.Category ? ad.Category.Id : 1}
                onChange={(e, option: IDropdownOption) => setAd({ ...ad, Category: getTermCategory(option.key.toString()) })}
            />
            <DatePicker
                minDate={new Date()}
                label="Publish date"
                value={ad.Date} 
                onSelectDate={(date: Date) => setAd({ ...ad, Date: accountForTimezone(date)})} />
            {
                isUserAdmin ? (
                    <PeoplePicker
                        context={context}
                        titleText="User *"
                        isRequired={true}
                        defaultSelectedUsers={[ad.User.Email]}
                        selectedItems={handleUserSelection}
                        principalTypes={[PrincipalType.User]} />
                ) :
                    (
                        null
                    )
            }
            <ImagePicker
                imagePath={ad.Attachments[0] ? ad.Attachments[0].Url : null}
                onImageSelected={(imageBlob: File) => setAd({ ...ad, Attachments: fileToAttachmentArray(imageBlob) })}
                onRemove={() => setAd({ ...ad, Attachments: [] })} />
            <PrimaryButton
                disabled={isButtonDisabled}
                text="Submit"
                onClick={submitAd} />
        </form>

    )


}