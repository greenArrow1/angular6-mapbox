import { CommonModule } from '@angular/common';  
import { NgModule } from '@angular/core';
import { FeedbackComponent } from './feedback.component';
import { FeedbackRoutingModule } from './feedback.routing';
import { SharedModule } from '../../shared/shared.module';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatrolTrackerService } from '../patroltracker/patroltracker.service';

@NgModule({
  imports: [
    CommonModule,FeedbackRoutingModule,SharedModule,FormsModule,MatBottomSheetModule,ReactiveFormsModule
  ],
  declarations: [
    FeedbackComponent
  ],
  providers: [MatBottomSheet,PatrolTrackerService],
  entryComponents: [FeedbackComponent]
})
export class FeedbackModule { }
