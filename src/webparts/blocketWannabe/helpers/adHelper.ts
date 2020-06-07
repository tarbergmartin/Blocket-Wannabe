import { Web, ItemAddResult } from "@pnp/sp";
import { ICategoryItem, IAdItem, IAttachment, IUser } from "../interfaces/Interfaces";
import { taxonomy, ITermStore, ITermSet, ITermData, ITerm, setItemMetaDataField } from "@pnp/sp-taxonomy";
import { IDropdownOption, IColumn } from "office-ui-fabric-react";

export async function getAllAds(web: Web): Promise<IAdItem[]> {

    const listItems = web.lists.getByTitle('Ads').items;
    console.log(listItems);
    const data = await listItems.select('Id', 'Title', 'Description', 'Price', 'Date', 'Category', 'UserId', 'Attachments').get();
    const ads: IAdItem[] = await Promise.all(data.map(async item => {

        const currentItem = listItems.getById(item.Id);

        const [user, attachmentData, category] = await Promise.all([
            web.siteUsers.getById(item.UserId).get(),
            listItems.getById(item.Id).attachmentFiles.get(),
            getCategoryById(item.Category.TermGuid),
        ]);

        const attachmentFiles: IAttachment[] = await Promise.all(attachmentData.map(async attachment => {

            const blob = await currentItem.attachmentFiles.getByName(attachment.FileName).getBlob();

            return {
                Url: `https://nackademiskt.sharepoint.com${attachment.ServerRelativePath.DecodedUrl}`,
                Blob: blob,
                FileName: attachment.FileName
            }
        }));

        return {
            Id: item.Id,
            Title: item.Title,
            Description: item.Description,
            Date: new Date(Date.parse(item.Date.substring(0, 10) + 'T00:00:00')),
            Price: item.Price,
            User: {
                UserId: user.Id,
                LoginName: user.LoginName,
                Email: user.Email,
                FullName: user.Title
            },
            Category: category,
            Attachments: attachmentFiles
        }
    }))

    return ads;
}

export async function removeAd(id: number, web: Web): Promise<boolean> {

    try {
        await web.lists.getByTitle('Ads').items.getById(id).delete();
        return true;
    }

    catch {
        return false;
    }
}

export function filterAdsByQuery(query: any, ads: IAdItem[]) {
    return ads.filter(ad => stringContains(ad.Title, query) || stringContains(ad.Category.CategoryName, query));
}

function stringContains(stringVal: string, stringToCheck: string): boolean {
    return stringVal.toLowerCase().indexOf(stringToCheck.toLowerCase()) === -1 ? false : true;
}

export function sortByPropName(ads: IAdItem[], propName: string, asc: boolean): IAdItem[] {
    return asc ? [...ads].sort(function (a, b) { return (a[propName] > b[propName]) ? 1 : ((b[propName] > a[propName]) ? -1 : 0); }) :
                 [...ads].sort(function (a, b) { return (a[propName] > b[propName]) ? -1 : ((b[propName] > a[propName]) ? 1 : 0); })
}


export async function getAllCategories(): Promise<ICategoryItem[]> {

    const store: ITermStore = taxonomy.termStores.getByName('Taxonomy_mzHZJt6CKwm2h90n2KLRXg==');
    const set: ITermSet = store.getTermSetById('5e5392d8-124f-4da0-8df8-ebd72944c97c');
    const terms: ITermData[] = await set.terms.select('Name', 'Id').get();

    return terms.map(term => {
        return {
            CategoryName: term.Name,
            Id: term.Id.substring(term.Id.indexOf('(') + 1, term.Id.indexOf(')'))
        }
    })
}

export async function getCategoryById(id: string): Promise<ICategoryItem> {

    const store: ITermStore = taxonomy.termStores.getByName('Taxonomy_mzHZJt6CKwm2h90n2KLRXg==');
    const set: ITermSet = store.getTermSetById('5e5392d8-124f-4da0-8df8-ebd72944c97c');
    const term: ITermData = await set.terms.getById(id).select('Name', 'Id').get();

    return {
        Id: term.Id.substring(term.Id.indexOf('(') + 1, term.Id.indexOf(')')),
        CategoryName: term.Name
    };
}

export async function addNewCategory(categoryName: string): Promise<ICategoryItem> {

    const store: ITermStore = taxonomy.termStores.getByName('Taxonomy_mzHZJt6CKwm2h90n2KLRXg==');
    const set: ITermSet = store.getTermSetById('5e5392d8-124f-4da0-8df8-ebd72944c97c');

    const isValid = await isValidTermCategory(categoryName, set);

    if (isValid) {
        try {
            const term: ITermData = await set.addTerm(categoryName, 1033, true);
            return {
                CategoryName: term.Name,
                Id: term.Id
            }
        }
        catch {
            return null;
        }
    }

    return null;
}

export async function isValidTermCategory(categoryName: string, termSet: ITermSet): Promise<boolean> {

    if (!categoryName || categoryName === '') {
        return false;
    }

    const terms: ITerm[] & ITermData[] = await termSet.terms.select('Name').get();
    return !terms.some((term: ITermData) => term.Name.toLowerCase() === categoryName.toLowerCase())
}

export async function addNewAd(ad: IAdItem, web: Web): Promise<ItemAddResult> {

    const { Attachments, Category, User, ...firstAdSubmit } = ad;

    try {

        const addedResult: ItemAddResult = await web.lists.getByTitle('Ads').items.add({
            ...firstAdSubmit,
            UserId: User.UserId
        });

        if (Attachments[0]) {
            addedResult.item.attachmentFiles.add(ad.Attachments[0].FileName, Attachments[0].Blob);
        }

        if (Category) {
            const categoryTerm = await taxonomy.getDefaultSiteCollectionTermStore().getTermById(Category.Id).get();
            await setItemMetaDataField(addedResult.item, 'Category', categoryTerm);
        }

        return addedResult;
    }

    catch (error) {
        console.log(error);
        return null;
    }
}

export async function updateExistingAd(ad: IAdItem, web: Web): Promise<ItemAddResult> {

    const { Attachments, Category, Id, User, ...firstAdSubmit } = ad;

    try {
        const addedResult: ItemAddResult = await web.lists.getByTitle('Ads').items.getById(Id).update({
            ...firstAdSubmit,
            UserId: User.UserId,
        });

        if (Attachments.length > 0) {
            const attachments = await addedResult.item.attachmentFiles.get();
            const attachmentNames = attachments.map(a => a.FileName);
            await addedResult.item.attachmentFiles.deleteMultiple(...attachmentNames);
            await addedResult.item.attachmentFiles.add(Attachments[0].FileName, Attachments[0].Blob);
        }

        else {
            const attachments = await addedResult.item.attachmentFiles.get();
            const attachmentNames = attachments.map(a => a.FileName);
            await addedResult.item.attachmentFiles.deleteMultiple(...attachmentNames);
        }


        if (Category) {
            const categoryTerm = await taxonomy.getDefaultSiteCollectionTermStore().getTermById(Category.Id).get();
            await setItemMetaDataField(addedResult.item, 'Category', categoryTerm);
        }

        return addedResult;
    }

    catch (error) {
        return null;
    }
}

export function getDefaultAd(currentUser: IUser): IAdItem {

    let user: IUser = {
        UserId: null,
        LoginName: null,
        Email: null,
        FullName: null
    }

    if (currentUser) {
        user.UserId = currentUser.UserId;
        user.LoginName = currentUser.LoginName;
        user.Email = currentUser.Email;
        user.FullName = currentUser.FullName
    }

    return {
        Title: '',
        Description: '',
        Price: 1,
        Date: new Date(),
        User: user,
        Attachments: [],
        Category: null
    };
}

export function getCategoryDropdownOptions(categories: ICategoryItem[]): IDropdownOption[] {
    return categories.map((category: ICategoryItem) => {
        return {
            key: category.Id,
            text: category.CategoryName
        }
    });
}

export function getCategoryListConfig(): IColumn[] {
    return [{
        key: 'Name',
        isPadded: true,
        name: 'Category',
        fieldName: 'CategoryName',
        minWidth: 100,
        maxWidth: 200,
        isResizable: false,
    }];
}

export function getAdListConfig(): IColumn[] {
    return [{
        key: 'CategoryName',
        isPadded: true,
        name: 'Category',
        fieldName: 'CategoryName',
        minWidth: 100,
        maxWidth: 200,
        isResizable: false,
    }];
}

export function fileToAttachmentArray(blob: File): IAttachment[] {

    const array = new Array<IAttachment>();

    array.push({
        Url: null,
        Blob: blob,
        FileName: blob.name
    })

    return array;
} 

