import { Component, Output, EventEmitter} from '@angular/core';
// import { MatBottomSheetRef } from '@angular/material';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import {slideInOutAnimation} from '../../../shared/components/animation/slide-in-out.component';
import { trigger, state, animate, transition, style } from '@angular/animations';
@Component({
  selector: 'app-jobdetail',
  templateUrl: './jobdetail.component.html',
  styleUrls: ['./jobdetail.component.css'],
  animations: [trigger('myAnimation', [
    state('*', style({
    
    })),
  
    transition(':enter', [
      
      style({
          bottom: '-100vh',
          backgroundColor: 'rgba(0, 0, 0, 0)'
      }),

      // animation and styles at end of transition
      animate('.5s ease-in-out', style({
          // transition the right position to 0 which slides the content into view
          bottom: -50,

          // transition the background opacity to 0.8 to fade it in
          backgroundColor: 'rgba(0, 0, 0, 0.8)'
      }))
  ]), // route 'leave' transition
  transition(':leave', [
      style({
        top: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
    }),

    // animation and styles at end of transition
    animate('.5s ease-in-out', style({
        // transition the right position to 0 which slides the content into view
        top: '-100vh',

        // transition the background opacity to 0.8 to fade it in
        backgroundColor: 'rgba(0, 0, 0, 0)'
    }))
  ])
]
)]
})

export class JobdetailComponent {
  transition = 'enter';
  panelOpenState = false;
  @Output() closeChildWindow = new EventEmitter<boolean>();
  
  constructor(/*private bottomSheetRef: MatBottomSheetRef<JobdetailComponent>*/) { }
  /**
   * close bottom-sheet and go back to patroltracker page.
   * @param event mouse event
   */
  goBack(event: MouseEvent):void{
    
    
    this.ngOnDestroy();
    event.preventDefault();
  }
 ngOnDestroy(): void {
   //Called once, before the instance is destroyed.
   //Add 'implements OnDestroy' to the class.
   this.transition = 'leave';
   this.closeChildWindow.emit(false);
 }

}
