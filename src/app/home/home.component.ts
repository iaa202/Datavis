import { Component,AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import {CustomerdashboardService} from '../customerdashboard.service';
import{GoogleapiService} from '../googleapi.service';
import{Company} from '../Models/company';
import{Location} from '../models/location';
import{Address} from '../models/address';
import {Geores, Geolocation} from '../models/geocoderes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements  AfterViewInit, OnInit {
  map: google.maps.Map;
  companys:Company[];
  loc:any;
  google:any;

  @ViewChild('mapWrapper', {static: false}) mapElement: ElementRef;
  constructor(private customerservice:CustomerdashboardService,private googleapi:GoogleapiService) {
    this.google=this.googleapi.getgoogle();
   }

  ngAfterViewInit() {
    this.initializeMap();
  }

  ngOnInit() {
    this.customerservice.getcustomers().subscribe(res=>{
     this.companys=<Company[]>res

    this.loc = new Promise ((resolve,reject)=>{
     resolve(this.companys.map(data=>{
       data.locations.map(loca=>{
        this.googleapi.getgeocode(loca.address).subscribe(res=>{
          if((<Geores>res).status=="OK"){
           loca.latitude=(<Geores>res).results[0].geometry.location.lat;
           loca.longtitude=(<Geores>res).results[0].geometry.location.lng;
          }
         
          })
       })
     })
      )
    });
    this.getlocations()
    },error=>{

    })
    this.google.charts.load('current', {packages: ['corechart']});
   this.google.charts.setOnLoadCallback(this.drawChart.bind(this));
}

drawChart(){
  var data = new this.google.visualization.DataTable();
      data.addColumn('string', 'Element');
      data.addColumn('number', 'Percentage');
      data.addRows([
        ['Nitrogen', 0.78],
        ['Oxygen', 0.21],
        ['Other', 0.01]
      ]);

      // Instantiate and draw the chart.
      var chart = new this.google.visualization.PieChart(document.getElementById('chart'));
      chart.draw(data, null);
}


getlocations(){
  Promise.all([this.loc]).then(val=>{
    console.log(this.companys);
  })
 }
  initializeMap() {
    const lngLat = new google.maps.LatLng(6.5874964, 3.9886097);
    const mapOptions: google.maps.MapOptions = {
      center: lngLat,
      zoom: 16,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

}
