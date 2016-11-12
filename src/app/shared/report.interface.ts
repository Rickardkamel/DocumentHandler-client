import { IArticle } from './article.interface';
import { ICustomer } from './customer.interface';
import { IReciever } from './reciever.interface';
import { ITransporter } from './transporter.interface';
import { IRegion } from './region.interface';

export interface IReport {
    id: number;
    info: string;
    customer: ICustomer;
    reciever: IReciever;
    transporter: ITransporter;
    lastEditBy: string;
    createdByUserName: string;
    createdDate: Date;
    orderedDate: Date;
    editedDate: Date;
    removedDate: Date;
    articles: IArticle[];
    approved: boolean;
    region: IRegion;
    wasteId: string;
}
