import { Injectable } from '@angular/core';
import{HttpClient, HttpHeaders} from '@angular/common/http';
import { Address } from './Models/address';
declare var google:any
@Injectable({
  providedIn: 'root'
})
export class GoogleapiService {
private google:any;
  constructor(private httpclient:HttpClient) {
this.google=google;
   }

   getgeocode(address:Address){
     if(!address.country){
      return this.httpclient.get("https://maps.googleapis.com/maps/api/geocode/json?address="+address.street+address.city+address.state+address.country+"&key=AIzaSyAPocyqGp7CTdUU1VhI42SyuROB1hnVNOc");
     }else{
    return this.httpclient.get("https://maps.googleapis.com/maps/api/geocode/json?address="+address.street+address.country.name+address.city+address.state+"&key=AIzaSyAPocyqGp7CTdUU1VhI42SyuROB1hnVNOc");
     }
}

getgoogle(){
  return this.google;
}
}
