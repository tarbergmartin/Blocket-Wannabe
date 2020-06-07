import { Web } from "@pnp/sp";
import { ITermData } from "@pnp/sp-taxonomy";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MessageBarType } from "office-ui-fabric-react";

export interface IAdItem {
  Id?: number;
  Title: string;
  Description: string;
  Price: number;
  Date: Date;
  User: IUser;
  Attachments: IAttachment[];
  Category: ICategoryItem;
}

export interface IAdViewProps {
  ad: IAdItem;
  onDismiss: () => void;
}

export interface IAdListCardProps {
  ad: IAdItem;
  existingAd?: IAdItem;
  isUserAdmin: boolean;
  categories: ICategoryItem[];
  context: WebPartContext;
  web: Web;
  currentUser: IUser;
  onSubmit: (ad: IAdItem | IAdItem) => Promise<void>;
  onAdClick: (ad: IAdItem) => void;
  onDelete: (userId: number) => Promise<void>;
}

export interface IAdminViewProps {
  addCategory?: (categoryName: string) => Promise<void>;
  categories?: ITermData[];
  context?: WebPartContext;
}

export interface IAdminView {
  addCategory?: (categoryName: string) => Promise<void>;
  categories?: ICategoryItem[];
}

export interface IAppMessageProps {
    appMessage: IMessage;
}

export interface ICategoryItem {
  CategoryName: string;
  Id: string;
}

export interface IImagePickerProps {
  imagePath?: string;
  onImageSelected: (file: File) => void;
  onRemove: () => void;
}

export interface IMainViewProps {
  ads: IAdItem[];
  existingAd?: IAdItem;
  isUserAdmin: boolean;
  categories: ICategoryItem[];
  context: WebPartContext;
  web: Web;
  currentUser: IUser;
  onSubmit: (ad: IAdItem | IAdItem) => Promise<void>;
  onDelete: (userId: number) => Promise<void>;
  onSort: (propName: string, isSortAsc: boolean) => void;
  onSearch: (query: string) => Promise<void>;
}

export interface IADListProps {
  ads: IAdItem[];
  existingAd?: IAdItem;
  isUserAdmin: boolean;
  categories: ICategoryItem[];
  context: WebPartContext;
  web: Web;
  currentUser: IUser;
  onSubmit: (ad: IAdItem | IAdItem) => Promise<void>;
  onDelete: (userId: number) => Promise<void>;
  onAdClick: (ad: IAdItem) => void;
  onSort: (propName: string, isSortAsc: boolean) => void;
  onSearch: (query: string) => Promise<void>;
}

export interface IMessage {
  message: string;
  messageBarType: MessageBarType;
}

export interface INewAdFormProps {
  existingAd?: IAdItem;
  isUserAdmin: boolean;
  categories: ICategoryItem[];
  context: WebPartContext;
  web: Web;
  currentUser?: IUser;
  onSubmit: (ad: IAdItem | IAdItem) => Promise<void>;
}

export interface IProps {
  description: string;
  context: WebPartContext;
}

export interface IState {
  visibleAds: IAdItem[]
  ads: IAdItem[];
  categories: ICategoryItem[];
  web: Web;
  currentUser: IUser;
  pivotSelectionKey: string;
  appMessage: IMessage;
}

export interface INumValidationResult {
  errorMessage: string;
  isValid: boolean;
}

export interface IUser {
  UserId: number;
  LoginName: string;
  Email: string;
  FullName: string;
  isAdAdmin?: boolean;
}

export interface IAttachment {
  Url: string;
  Blob: any;
  FileName: string;
}
