import { CommonModule } from '@angular/common';  
import { NgModule } from '@angular/core';
import { Home } from './home.component';
import { routing } from './home.routing';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  imports: [
    routing,CommonModule,SharedModule
  ],
  declarations: [
    Home
  ],
  providers: [],
})
export class HomeModule { }
