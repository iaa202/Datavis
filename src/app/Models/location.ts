import{Address} from './address';
export class Location {
 name:string;
 code:string;
 phoneNo:string;
 address:Address;
 id:number;
 companyID:number;
 userCreated:number;
 userModified:number;
 longtitude:any;
 latitude:any;

 constructor(name:string,phone:string,address:Address,companyid:number){
     this.name=name;
     this.phoneNo=phone;
     this.address=address;
     this.companyID=companyid;
 }
}
