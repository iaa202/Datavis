import { Component, OnInit } from '@angular/core';
import { CustomerdashboardService } from '../customerdashboard.service';
import { Company } from '../Models/company';
import { Report } from '../Models/report';
import * as numeral from 'numeral';

@Component({
  selector: 'app-sideinfo',
  templateUrl: './sideinfo.component.html',
  styleUrls: ['./sideinfo.component.scss']
})
export class SideinfoComponent implements OnInit {

  constructor(private customerservice:CustomerdashboardService) { }


  companys:Company[];
  loc:any;
  nofcustomers=0;
  noflocations=0;
  nofusers=0;
  nofsales=0;
  valofsales=0;
  height:number;
comploc=0;
compusers=0;
compsales=0;
compvalsales=0;

  ngOnInit() {
    this.height=window.innerHeight/5
    this.customerservice.getcustomers().subscribe(res=>{
      this.companys=<Company[]>res
      this.nofcustomers=this.companys.length;
      this.getstats();
    this.getsalesvolandval();
      
     
    
     
    });
   
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

 
  
 
}

getsalesvolandval(){
  
  this.companys.map(data=>{
    this.customerservice.getsalesvolval(data.id).subscribe(res=>{
      (<Report[]>res).map(rep=>{
       this.nofsales=this.nofsales+ rep.vol;
       this.valofsales=this.valofsales+rep.val;
      })
    })
  })
}

formatPrice(price, dropDecimals = false) {
  return numeral(price).format(dropDecimals ? '0,0' : '0,0.00');
}


}
