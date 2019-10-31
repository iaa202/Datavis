import { Component,AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import {CustomerdashboardService} from '../customerdashboard.service';
import{GoogleapiService} from '../googleapi.service';
import{Company} from '../Models/company';
import{Location} from '../models/location';
import{Address} from '../models/address';
import {Geores, Geolocation} from '../models/geocoderes';
import { Country } from '../Models/country';
import { getHeapStatistics } from 'v8';
import { Report } from '../Models/report';


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
  mapheader="Where are Simplify Users?"
  nofcustomers=0;
  noflocations=0;
  nofusers=0;
  nofsales=0;
  valofsales=0;
comploc=0;
compusers=0;
compsales=0;
compvalsales=0;



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
      this.nofcustomers=this.companys.length;
    //  this.getstats();
      this.loadmap();
    
     
    });

  this.google.charts.load('current', {packages: ['corechart']});
 // this.google.charts.setOnLoadCallback(this.drawChart.bind(this)); 
 
}
//problem method
getstats(){
  this.companys.map(data=>{
   data.locations.map(loc=>{
     this.noflocations=this.noflocations+1;
   })
   this.customerservice.getusers(data.id).subscribe(res=>{
    this.nofusers=this.nofusers+(<Company[]>res).length;
  })
  })

  // //need set API for these
  // this.companys.map(data=>{
  //   this.customerservice.getusers(data.id).subscribe(res=>{
  //     this.nofusers=this.nofusers+(<Company[]>res).length;
  //   })
  // })
  
  this.companys.map(data=>{
    this.customerservice.getsalesvolval(data.id).subscribe(res=>{
      (<Report[]>res).map(rep=>{
       this.nofsales=this.nofsales+ rep.vol;
       this.valofsales=this.valofsales+rep.val;
      })
    })
  })
 
}

drawChart(dat:Company){

  this.customerservice.getsalesvolval(dat.id).subscribe(res=>{
    var data = new this.google.visualization.DataTable();
    data.addColumn('string', 'Element');
    data.addColumn('number', 'Percentage');
    (<Report[]>res).map(report=>{
      data.addRows([
        [report.locationName,report.val]
      ])
    })

   

      // Instantiate and draw the chart.
      var chart = new this.google.visualization.PieChart(document.getElementById('chart'));
      var options = {
        title: 'Sales By Location',
        is3D: true,
      };
      chart.draw(data, options);
  
  })
 

    
}


  initializeMap(lat,lng) {
    const coord = new this.google.maps.LatLng(lat,lng)
    const mapOptions: google.maps.MapOptions = {
      center: coord,
      zoom: 10,
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
            var marker = new this.google.maps.Marker({position:cord,map:this.map,animation: this.google.maps.Animation.DROP,title:data.name})
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
            this.drawChart(data);
            this.showcomp(data);
            this.markerlist.map(mark=>{
              if(mark.title!=data.name){
                mark.setMap(null);
              }else{
              this.map.setCenter(mark.position);
             mark.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
              }
            })
           
            this.map.setZoom(12);
        });
            this.markerlist.push(marker);
          }
          
        })
      })
    })
  })
  }

  showcomp(data:Company){
    
    this.mapheader=data.name;
    this.comploc=data.locations.length;
    this.customerservice.getusers(data.id).subscribe(res=>{
      this.compusers=(<Company[]>res).length;
    })
    this.customerservice.getsalesvolval(data.id).subscribe(res=>{
      (<Report[]>res).map(rep=>{
        this.compsales=this.compsales+rep.vol;
        this.compvalsales=this.compvalsales+rep.val;
      })
    })
      
  }

  resetmap(){
    this.storeinf=false;
    this.comploc=0;
    this.compusers=0;
    this.compsales=0;
    this.compvalsales=0;
   this.markerlist.map(mark=>{
     mark.setMap(this.map);
    // mark.setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
    mark.setIcon(null);
   })
   this.mapheader="Where are Simplify Users?"
   this.map.setZoom(10);
  }

  loadmap(){
   this.googleapi.getgeocode(this.companys[25].locations[0].address).subscribe(res=>{
    if((<Geores>res).status=="OK"){
      this.initializeMap((<Geores>res).results[0].geometry.location.lat,(<Geores>res).results[0].geometry.location.lng)
   
     }
   })
  }

}
