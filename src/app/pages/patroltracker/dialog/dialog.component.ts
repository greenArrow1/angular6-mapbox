import { Component, Inject} from '@angular/core';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../patroltracker.component';
@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'dialog.html',
    styleUrls: ['./dialog.css']
  })
  export class Dialog {
  
    constructor(
      public dialogRef: MatDialogRef<Dialog>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
}
  