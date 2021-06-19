import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  local_data: any;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EmployeeFormComponent>) {
    this.local_data = { ...data };
    console.log('localdata', this.local_data);
  }

  ngOnInit(): void {
    
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  doAction() {
    this.dialogRef.close({ event: this.local_data.action, data: this.local_data });
  }

}
