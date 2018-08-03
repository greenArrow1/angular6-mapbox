import { Component, OnInit, Injector } from '@angular/core';
import { LoggerService } from '../../shared/services/logger.service';
import { Router } from '@angular/router';
@Component({
  selector: 'home',
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  error:any;
  popupData:any ={};
  constructor(private injector: Injector) { }

  ngOnInit() {
    console.log("hello");
    // Just to make sure `auth_token` is clear when, landed on this page
    // let errorData = JSON.parse(sessionStorage.getItem('error'));
    // if(errorData){
    //   this.errorMessage = errorData.message;
    //  this.errorStatus = errorData.status;
    // }LoggerService.

    // let loggerService = this.injector.get(LoggerService);
    // let error = loggerService.getErrorList();
   this.error = LoggerService.getErrorList();
  }
  
}
