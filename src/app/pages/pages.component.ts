import { Component, OnInit } from '@angular/core';
// <div fxLayout fxLayoutAlign="center center" style="background-color:blue;">
//           <mat-spinner></mat-spinner>
//         </div>
@Component({
  selector: 'pages',
  template: `
        <div class="container">
          <app-header></app-header>
            <router-outlet></router-outlet>
        </div>
    `,
    styles:[`:host {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100vh;
    }    
    .container {
      display: flex;
      height: 100%;
      align-items: center;
    }
    `]

})
export class Pages implements OnInit {
 
  constructor() {
      
  }

  ngOnInit() {

    

  }
}
