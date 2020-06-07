import { Web } from "@pnp/sp";
import { IODataUser } from "@microsoft/sp-odata-types";
import { IUser } from "../interfaces/Interfaces";

export async function isUserAdAdmin(web: Web): Promise<boolean> {

    let isAdAdmin: boolean;

    try {
        await web.currentUser.groups.getByName('AdAdmin').get()
        isAdAdmin = true;
    }

    catch {
        isAdAdmin = false;
    }

    return isAdAdmin;
}

export async function getCurrentUser(web: Web): Promise<IUser> {

    const [user, isAdAdmin] = await Promise.all([
        web.currentUser.select('Title', 'Email', 'Id', 'LoginName').get(),
        isUserAdAdmin(web)
    ]);

    return {
        UserId: user.Id,
        LoginName: user.LoginName,
        FullName: user.Title,
        Email: user.Email,
        isAdAdmin: isAdAdmin
    };
}

export function isUserAdCreator(currentUser: IUser, adUser: IUser): boolean {
    return currentUser.Email === adUser.Email;
}

export async function getUserByLoginName(loginName: string, currentWeb: Web): Promise<IODataUser> {
    return await currentWeb.siteUsers.getByLoginName(loginName).get();
}