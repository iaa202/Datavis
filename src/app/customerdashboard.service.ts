import { Injectable } from '@angular/core';
import{HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerdashboardService {

  api="http://mercatordcr.azurewebsites.net/api/";
 // api="https://simplifyapi.azurewebsites.net/api/";

  constructor(private httpclient:HttpClient) {

   }
   getcustomers(){
  return this.httpclient.get(this.api+"Company/GetAll");
   }

   getlocations(id:number){
     return this.httpclient.get(this.api+"Location/GetByCompany/"+id);

   }

   getcountrys(){
     return this.httpclient.get(this.api+"Country/Get");
   }
   getusers(id){
return this.httpclient.get(this.api+"User/GetByCompany/"+id);
   }

   getsalesvolval(id){
    return this.httpclient.get(this.api+"Report/GetSaleSummary/"+id+"/0/0/0");
   }
}
