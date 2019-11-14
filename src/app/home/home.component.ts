import { Component,AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import {CustomerdashboardService} from '../customerdashboard.service';
import{GoogleapiService} from '../googleapi.service';
import{Company} from '../Models/company';
import{Location} from '../models/location';
import{Address} from '../models/address';
import { formatDate } from '@angular/common';
import {Geores, Geolocation} from '../models/geocoderes';
import { Country } from '../Models/country';
import { Report } from '../Models/report';
declare var MarkerClusterer;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements  AfterViewInit, OnInit {
  today:Date=new Date();
  tod=Date.now();
  dayweek=1;
  guagedata=0;
  map: google.maps.Map;
  companys:Company[];
  MarkerClusterer:any;
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
  height:number;
  height2:number;
comploc=0;
compusers=0;
compsales=0;
compvalsales=0;
piedata:Report[]=[]



  @ViewChild('mapWrapper', {static: false}) mapElement: ElementRef;
  constructor(private customerservice:CustomerdashboardService,private googleapi:GoogleapiService) {
    this.google=this.googleapi.getgoogle();
   }

  ngAfterViewInit() {
  // this.loadmap();
  }

  ngOnInit() {
    this.height=window.innerHeight/3;
    this.height2=this.height/4;
    this.MarkerClusterer=MarkerClusterer;
    this.customerservice.getcustomers().subscribe(res=>{
      this.companys=<Company[]>res
      this.loadmap();
     
    
     
    });

  this.google.charts.load('current', {packages: ['corechart']});
  this.google.charts.load('current', {'packages':['gauge']});
  this.google.charts.load('current', {'packages':['bar']});
 // this.google.charts.setOnLoadCallback(this.drawChart.bind(this)); 
 
}



drawChart(dat:Company){
 var t=Date.now();
 var lw= t-(86400000*6)
  this.customerservice.getsalesvolval2(dat.id,formatDate(lw,'dd-MM-yyyy','en'),formatDate(t,'dd-MM-yyyy','en')).subscribe(res=>{
   this.piedata=<Report[]>res;
    var data = new this.google.visualization.DataTable();
    data.addColumn('string', 'Element');
    data.addColumn('number', 'Percentage');
   
   
    (<Report[]>res).map(report=>{
      data.addRows([
        [report.locationName,report.vol]
      ])
    })

   

      // Instantiate and draw the chart.
      var chart = new this.google.visualization.PieChart(document.getElementById('chart'));
      var options = {
        title: 'Weekly Sales volume By Location',
        is3D: true,
      };
      chart.draw(data, options);
      this.google.visualization.events.addListener(chart,'onmouseover', (event)=> {
        this.handleselect(event)
      
      })
      this.google.visualization.events.addListener(chart,'onmouseout', (event)=> {
       this.map.setZoom(12);
      
      })
      this.drawguagechart(dat) 
      this.drawbar();
  
  }) 
   
}


handleselect(e){
console.log(this.piedata[e["row"]]);
var sublist= this.markerlist.filter(m=>m.map!=null);
sublist.map(m=>{
  if((<String>m.title).includes(this.piedata[e["row"]].locationName)){
    this.map.setCenter(m.position);
    this.map.setZoom(20);
  }

})
}




drawguagechart(comp:Company){
  this.customerservice.getsalesvolval2(comp.id,formatDate(this.tod,'dd-MM-yyyy','en'),formatDate(this.tod,'dd-MM-yyyy','en')).subscribe(res=>{
   if((<Report[]>res).length>0){
     this.guagedata++;
     console.log(this.guagedata);
   }
    this.tod=this.tod-86400000
    this.dayweek++;
    if(this.dayweek<=7){
      this.drawguagechart(comp);
    }else{
      console.log(this.guagedata);
     this.guagedata=(this.guagedata/7)*100
      var data = this.google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['Activity', this.guagedata]
      ]);
      var options = {
        redFrom: 0, redTo: 50,
        yellowFrom:50, yellowTo: 80,
        minorTicks: 5
      };
      var chart = new this.google.visualization.Gauge(document.getElementById('guage'))
    chart.draw(data,options);
    }
  })
  
  
}

drawbar() {
  var data = this.google.visualization.arrayToDataTable([
    ['Day', 'Sales'],
    ['Sun', 1000],
    ['Mon', 1170],
    ['Tue', 660],
    ['Wed', 1030],
    ['Thurs', 500],
    ['Frid', 1200],
    ['Sat', 1030],

  ]);

  var options = {
    chart: {
      title: 'Weekly Sales',
     // subtitle: 'Sales, Expenses, and Profit: 2014-2017',
    },
    bars: 'horizontal' // Required for Material Bar Charts.
  };

  var chart = new this.google.charts.Bar(document.getElementById('bar'));

  chart.draw(data, this.google.charts.Bar.convertOptions(options));
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
    // this.map.addListener('zoom_changed',event=>{
    //   if(this.markerlist.length>0){
    //     var markerCluster = new this.MarkerClusterer(this.map, this.markerlist,
    //       {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

    //   }
    // })
    
  

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
            var marker = new this.google.maps.Marker({position:cord,map:this.map,animation: this.google.maps.Animation.DROP,title:data.name+loc.name})
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
              if(!(<String>mark.title).includes(data.name)){
                mark.setMap(null);
              }else{
              this.map.setCenter(mark.position);
             mark.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
              }
            })
           
            this.map.setZoom(12);
        });
            this.markerlist.push(marker);
              // var markerCluster = new this.MarkerClusterer(this.map, this.markerlist,
              //   {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
         
            
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
    this.guagedata=0;
    this.dayweek=1;
    this.tod=Date.now();
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
