import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component'
import {MainComponent} from './main/main.component'

const routes: Routes = [
  {path:'',component:MainComponent,pathMatch:'full',children:[
    {path:'',component:HomeComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
