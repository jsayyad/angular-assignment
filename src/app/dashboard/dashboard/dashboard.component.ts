import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { startWith, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { Subscription } from 'rxjs';

interface employee {
  name: string,
  address: address,
  company: company,
  id: number
}

interface company {
  name: string,
  catchPhrase: string,
  bs: string
}

interface address {
  street: string,
  suite: string,
  city: string,
  zipcode: string,
  phone: string,
  website: string,
  geo: geolocation
}

interface geolocation {
  lat: string,
  lng: string
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  employeeForm: FormGroup = new FormGroup({});
  employeeData: Array<employee> = [];
  deletedEmployeeData: Array<employee> = [];
  namecontrol = new FormControl();
  addresscontrol = new FormControl();
  companycontrol = new FormControl();

  namecontrol1 = new FormControl();
  addresscontrol1 = new FormControl();
  companycontrol1 = new FormControl();

  filteredOptions: any;
  filteredOptionsAddress: any;
  filteredOptionsCompany: any;
  allEmployeeData: Array<employee> = [];

  constructor(private activatedRoute: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getEmployeeData();
    this.initiateFormControls();
  }

  initiateFormControls() {
    this.filteredOptions = this.namecontrol.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val,'name'))
      );

      this.filteredOptionsAddress = this.addresscontrol.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val,'address'))
      );

      this.filteredOptionsCompany = this.companycontrol.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val,'company'))
      );
  }

  getEmployeeData() {
    this.activatedRoute.data.subscribe((data) => {
      this.employeeData = data.employees;
      this.allEmployeeData = JSON.parse(JSON.stringify(this.employeeData));
    });
  }


  deleteEmployeeData(index: number) {
    let removedElement = this.employeeData[index];
    this.deletedEmployeeData.push(removedElement);
    this.employeeData.splice(index, 1);
  }

  restoreEmployeeData(index: number) {
    let currentRestoreObj = this.deletedEmployeeData[index];
    this.employeeData.push(currentRestoreObj);
    this.employeeData.sort((a, b) => Number(a.id) - Number(b.id));
    this.deletedEmployeeData.splice(index, 1);
  }

  filter(val: string,type:string) {
    if (val) {
      let tempArr: Array<employee> = JSON.parse(JSON.stringify(this.allEmployeeData));
      let filterSet = [];
        if(type=='name'){
          filterSet =  tempArr.filter(option =>option.name.toLowerCase().includes(val.toLowerCase()))
        } else if(type=="address"){
           filterSet =  tempArr.filter(option =>option.address.street.toLowerCase().includes(val.toLowerCase()))
        } else if(type=="company"){
          filterSet =  tempArr.filter(option =>option.company.name.toLowerCase().includes(val.toLowerCase()))
        }
      this.employeeData = filterSet;
      return filterSet;
    } else {
      return [];
    }
  }
  

  openDialog(obj, action) {
    let newObj = { "name": '', "company": {}, "address": {} };
    let tempObj = {
      action: action,
      data: action == "Edit" ? JSON.parse(JSON.stringify(obj)) : newObj
    }
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '60%',
      data: tempObj,
      backdropClass: 'backdropBackground'
    });
    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.mapEmployeeResponse(result);
        }
      })
    );
  }

  mapEmployeeResponse(result: any) {
    if (result)
      switch (result.event) {
        case 'Add':
          this.employeeData.push(result.data.data);
          this.allEmployeeData = JSON.parse(JSON.stringify(this.employeeData))
          break;
        case 'Edit':
          var itemIndex = this.employeeData.findIndex(x => x.id == result.data.data.id);
          this.employeeData[itemIndex] = result.data.data;
          var itemIndexs = this.allEmployeeData.findIndex(x => x.id == result.data.data.id);
          this.allEmployeeData[itemIndexs] = result.data.data;
          break;
      }
  }
}
