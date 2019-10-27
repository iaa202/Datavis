import { Country } from "./country";
import { State } from "./state";
import { Lga } from "./lga";

export class Address {
    street: string;
    city:string;
    lga:Lga;
    lgaid:number;
    country:Country;
    state:State;
    stateID:number;
    countryID:number;
    id:number;
    companyID:number
    userCreated:number

  
    
    constructor(s:string,c:string,lgaid:number,stid:number,counid:number){
        this.street=s;
        this.city=c;
       this.lgaid=lgaid;
        this.stateID=stid;
       this.countryID=counid;

    }
}


