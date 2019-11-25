import { Injectable } from '@angular/core';
import{HttpClient, HttpHeaders} from '@angular/common/http';
import{environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerdashboardService {

 

  constructor(private httpclient:HttpClient) {

   }
   getcustomers(){
  return this.httpclient.get(environment.api+"Company/GetAll");
   }

   getlocations(id:number){
     return this.httpclient.get(environment.api+"Location/GetByCompany/"+id);

   }

   getcountrys(){
     return this.httpclient.get(environment.api+"Country/Get");
   }
   getusers(id){
return this.httpclient.get(environment.api+"User/GetByCompany/"+id);
   }

   getsalesvolval2(id,start,end){
    return this.httpclient.get(environment.api+"Report/GetSaleSummary/"+id+"/0/" +start+ "/" + end);
   }
   getsalesvolval(id){
    return this.httpclient.get(environment.api+"Report/GetSaleSummary/"+id+"/0/0/0");
   }

   getcurrentsales(id){
    return this.httpclient.get(environment.api+"SaleRegister/GetByCompany/"+id+"/0/0");
   }
}
