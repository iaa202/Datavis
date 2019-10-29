import { Component,AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import {CustomerdashboardService} from '../customerdashboard.service';
import{GoogleapiService} from '../googleapi.service';
import{Company} from '../Models/company';
import{Location} from '../models/location';
import{Address} from '../models/address';
import {Geores, Geolocation} from '../models/geocoderes';
import { Country } from '../Models/country';


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
  markerlist=[];
  storeinf=false;

  @ViewChild('mapWrapper', {static: false}) mapElement: ElementRef;
  constructor(private customerservice:CustomerdashboardService,private googleapi:GoogleapiService) {
    this.google=this.googleapi.getgoogle();
   }

  ngAfterViewInit() {
  // this.loadmap();
  }

  ngOnInit() {
    this.customerservice.getcustomers().subscribe(res=>{
      this.companys=<Company[]>res
      this.loadmap();
    });

   /*  this.customerservice.getcustomers().subscribe(res=>{
     this.companys=<Company[]>res
    this.loc = new Promise ((resolve,reject)=>{
     resolve(this.companys.map(data=>{
       data.locations.map(loca=>{
        this.googleapi.getgeocode(loca.address).subscribe(res=>{
          if((<Geores>res).status=="OK"){
           loca.latitude=(<Geores>res).results[0].geometry.location.lat;
           loca.longtitude=(<Geores>res).results[0].geometry.location.lng;
           this.loclist.push(new Geolocation(loca.latitude,loca.longtitude));
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
  // this.google.charts.setOnLoadCallback(this.drawChart.bind(this)); */
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


/* getlocations(){
  Promise.all([this.loc]).then(val=>{
   this.initializeMap();
   
  })
 } */
  initializeMap(lat,lng) {
    const coord = new this.google.maps.LatLng(lat,lng)
    const mapOptions: google.maps.MapOptions = {
      center: coord,
      zoom: 9,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false
      
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    //var marker = new this.google.maps.Marker({position:coord,map:this.map})

    this.companys.map(data=>{
      data.locations.map(loc=>{
        //temp function
        this.customerservice.getcountrys().subscribe(res=>{
           res=(<Country[]>res).filter(add=>add.id===loc.address.countryID);
          if((<Country[]>res).length>0){
           loc.address.country=(<Country[]>res)[0]
          }
      //end of temp
        this.googleapi.getgeocode(loc.address).subscribe(res=>{
          if((<Geores>res).status=="OK"){
            var cord= new this.google.maps.LatLng((<Geores>res).results[0].geometry.location.lat,(<Geores>res).results[0].geometry.location.lng)
            var marker = new this.google.maps.Marker({position:cord,map:this.map,animation: this.google.maps.Animation.DROP})
            var infowindow = new google.maps.InfoWindow({
              content:data.name + ", "+ loc.name
            });
            marker.addListener('mouseover', function() {
              infowindow.open(this.map, marker);
            });
            marker.addListener('mouseout', function() {
              infowindow.close();
          });
          marker.addListener('click', (event)=> {
            console.log(loc);
            this.storeinf=true;
      
        });
            this.markerlist.push(marker);
          }
          
        })
      })
    })
  })
  }


  loadmap(){
   this.googleapi.getgeocode(this.companys[25].locations[0].address).subscribe(res=>{
    if((<Geores>res).status=="OK"){
      this.initializeMap((<Geores>res).results[0].geometry.location.lat,(<Geores>res).results[0].geometry.location.lng)
   
     }
   })
  }

}
