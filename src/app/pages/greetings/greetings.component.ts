import { Component, OnInit } from '@angular/core';
//import { MatBottomSheetRef } from '@angular/material';


@Component({
  selector: 'app-greetings',
  templateUrl: './greetings.component.html',
  styleUrls: ['./greetings.component.css']
})
export class GreetingsComponent implements OnInit{

  constructor() { }
ngOnInit(){
  sessionStorage.removeItem("patrolservice");
}
  /* goBack(event: MouseEvent):void{
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  } */
  

}
