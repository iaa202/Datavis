import { Component,AfterViewInit, ViewChild, ElementRef, OnInit, ɵConsole } from '@angular/core';
import {CustomerdashboardService} from '../customerdashboard.service';
import{GoogleapiService} from '../googleapi.service';
import{Company} from '../Models/company';
import { formatDate } from '@angular/common';
import {Geores} from '../Models/geocoderes';
import { Country } from '../Models/country';
import { Report } from '../Models/report';
import * as numeral from 'numeral';
import { VirtualTimeScheduler } from 'rxjs';
import { Saleshistory } from '../Models/saleshistory';
import { SideinfoComponent } from '../sideinfo/sideinfo.component';
declare var MarkerClusterer;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements  AfterViewInit, OnInit {
  today:Date=new Date();
  tod=Date.now();
  tod2=Date.now();
  dayweek=1;
  day;
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
tabledata:Saleshistory[]=[];
bardata=[];



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
      this.drawdonut();
      this.drawcombo();
      this.drawtable();
     
    
     
    });

  this.google.charts.load('current', {packages: ['corechart']});
  this.google.charts.load('current', {'packages':['gauge']});
  this.google.charts.load('current', {'packages':['bar']});
  this.google.charts.load('current', {'packages':['table']});
 // this.google.charts.setOnLoadCallback(this.drawChart.bind(this)); 
 
}

formatPrice(price, dropDecimals = false) {
  return numeral(price).format(dropDecimals ? '0,0' : '0,0.00');
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
       this.day=this.today.getDay();
       console.log(this.day);
      this.tod2=Date.now();
      this.drawbar(dat);
  
  }) 
   
}





handleselect(e){

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
  
   }
    this.tod=this.tod-86400000
    this.dayweek++;
    if(this.dayweek<=7){
      this.drawguagechart(comp);
    }else{
      
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

drawbar(comp:Company) {
   if(this.day===0){
    this.day=7;
  }
 var day = this.getday(this.day);
 console.log(day);
  this.customerservice.getsalesvolval2(comp.id,formatDate(this.tod2,'dd-MM-yyyy','en'),formatDate(this.tod2,'dd-MM-yyyy','en')).subscribe(async data=>{
//   // this.bardata.({name:day,value:this.calculatetotal(<Report[]>data)});
console.log(data);
   this.bardata.push(
    [day,this.calculatetotal(<Report[]>data)]
  )
   console.log(this.bardata);
if(this.bardata.length===7){
  var barchart= this.google.visualization.arrayToDataTable([
    ['Sales', 'Value'],
      this.bardata[0],
      this.bardata[1],
      this.bardata[2],
      this.bardata[3],
      this.bardata[4],
      this.bardata[5],
      this.bardata[6]
  ]);
  var options = {
          chart: {
             title: 'Weekly Sales Value',
           
           },
          bars: 'horizontal' // Required for Material Bar Charts.
        };
      
        var chart = new this.google.charts.Bar(document.getElementById('bar'));
      
        chart.draw(barchart, this.google.charts.Bar.convertOptions(options));
}else{
  this.day=this.day-1;
  this.tod2=this.tod2-86400000;
  this.drawbar(comp);
}
   });

  

  
}

getday(day:number):string{
  if(day===1){
    return "Mon"
  }else if(day===2){
    return "Tue"
  }else if(day===3){
    return "Wed"
  }else if(day===4){
    return "Thurs"
  }else if(day===5){
    return "Frid"
  }else if(day===6){
    return "Sat"
  }else if(day===7){
    return "Sun"
  }
  }
  calculatetotal(data:Report[]){
  var total=0;
  data.map((d)=>{total=total+d.val})
  return total;
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
    //  this.map.addListener('zoom_changed',event=>{
    //  if(this.markerlist.length>0){
    //     var markerCluster = new this.MarkerClusterer(this.map, this.markerlist,
    //      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

      // }
    //  })
    
  

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
               //  {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
         
            
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
    this.bardata=[];
    this.tod2=Date.now();
    this.day=this.today.getDay();
    this.tod=Date.now();
    this.comploc=0;
    this.compusers=0;
    this.compsales=0;
    this.compvalsales=0;
   this.markerlist.map(mark=>{
     mark.setMap(this.map);
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


  drawdonut(){
    var data = this.google.visualization.arrayToDataTable([
      ['Task', 'Hours per Day'],
      ['Fashion/Boutique',     11],
      ['Restaurant',      2],
      ['Laundry',  2],
      ['Salon/Spa', 2],
      ['Supermarket',    7]
    ]);

    var options = {
      title: 'Customers By Sector',
      pieHole: 0.4,
    };

    var chart = new this.google.visualization.PieChart(document.getElementById('donut'));
    chart.draw(data, options);
  }

  drawcombo(){
    var data = this.google.visualization.arrayToDataTable([
      ['Day', 'SalesVol', 'SalesVal'],
      ['Mon',  50,      1000,                       ],
      ['Tue',  200,      2000,                      ],
      ['Wed',  120,      5400,                      ],
      ['Thurs',  0,      0,                       ],
      ['Frid',  500,      1000,                    ],
      ['Sat',  300,      5400,                   ],
      ['Sun',  100,      500,                     ],
    ]);

    var options = {
      title : 'Weekly Sales Volume and Value',
      vAxis: {title: 'Sales'},
      hAxis: {title: 'Day'},
      seriesType: 'bars',
      series: {1: {type: 'line'}}        };

    var chart = new this.google.visualization.ComboChart(document.getElementById('combo'));
    chart.draw(data, options);
  }


  drawtable(){

    var count=0;
    this.companys.map(comp=>{
      this.customerservice.getcurrentsales(comp.id).subscribe(data=>{
        if((<Saleshistory[]>data).length!=0){
   (<Saleshistory[]>data).map(sale=>{this.tabledata.push(sale)})
        }
   count++;
     if(count===this.companys.length){
     console.log(this.tabledata);
  //need to sort array by date;
  this.tabledata=this.tabledata.sort((sale1,sale2)=>{
    var time =new Date(sale1.salesDate).getHours();
    var time2= new Date(sale2.salesDate).getHours();
    console.log(time,time2)
  if(time<time2){
    return -1;
  }else if(time==time2){
if(new Date(sale1.salesDate).getMinutes()< new Date(sale2.salesDate).getMinutes()){
  return -1;
}
  }
  
    return 0;
  })
 console.log(this.tabledata);
 this.tabledata.reverse();
 if(this.tabledata.length>8){
   this.tabledata.slice(0,7);
 }
  var dat = new this.google.visualization.DataTable();
    dat.addColumn('string', 'Company');
    dat.addColumn('string', 'Location');
    dat.addColumn('string', 'Date');
    dat.addColumn('number', 'Sales Val');
    this.tabledata.map(sale=>{
      console.log(this.getcompanyname(sale.companyID))
      dat.addRows([
        [this.getcompanyname(sale.companyID), this.getlocationname(sale.companyID,sale.locationID),formatDate(sale.salesDate,'HH:mm','en'),sale.totalAmount],
       
        
      ]);
    })
    

    var table = new this.google.visualization.Table(document.getElementById('table'));

  
    table.draw(dat, {showRowNumber: true, width: '100%', height: '100%'});

     }
      },error=>{

      })
    })

    
  }

  getcompanyname(compid):String{
    var compname=(this.companys.find(comp=> comp.id===compid)).name;
    return compname;

  }
  getlocationname(compid,lid):String{
   var lname= this.companys.find(comp=>comp.id===compid).locations.find(l=>l.id===lid).name;
   return lname;

  }

  

}

