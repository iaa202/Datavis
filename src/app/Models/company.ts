import{Location} from './location'
import { Sector } from './sector';

export class Company {
    name:string;
    description:string;
    email:string;
    phoneNo:string;
    url:string;
    logo:string;
    thankYouMessage:string;
    isEazyShoppingEnabled:boolean;
    //Added receipt url property
    receiptUrl: string;
    refundPolicy:string;
    currency:string;
    locations:Location[];
    sector:Sector;
    sectorID:number;
    appSector:number;
    id:number;
}