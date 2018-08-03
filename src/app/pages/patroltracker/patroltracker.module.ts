import { CommonModule } from '@angular/common';  
import { NgModule } from '@angular/core';
import { PatrolTrackerComponent } from './patroltracker.component';
import { routing } from './patroltracker.routing';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { JobdetailComponent } from './jobdetail/jobdetail.component';
import { SharedModule } from '../../shared/shared.module';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material';
import { environment } from '../../../environments/environment';
import { PatrolTrackerService } from './patroltracker.service';
import { PolyLineService } from './polyline.service';
import {FormsModule} from '@angular/forms';
import { Dialog } from './dialog/dialog.component';



@NgModule({
  imports: [
    routing,CommonModule,MatBottomSheetModule,FormsModule,
    NgxMapboxGLModule.forRoot({
      accessToken: environment.accessTokenMapbox
    }),
    SharedModule
  ],
  declarations: [
    PatrolTrackerComponent,
    JobdetailComponent,
    Dialog
  ],
  providers: [MatBottomSheet,PatrolTrackerService,PolyLineService],
  entryComponents: [PatrolTrackerComponent, JobdetailComponent,Dialog]
})
export class PatrolTrackerModule { }
