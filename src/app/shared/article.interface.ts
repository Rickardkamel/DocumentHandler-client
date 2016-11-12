import { IVessel } from './vessel.interface';
import { IWaste } from './waste.interface';


export interface IArticle {
    id: number;
    wasteId: string;
    waste: IWaste;
    quantity: number;
    exchange: number;
    info: string;
    vessel: IVessel;
}
