import { HttpClient } from '@angular/common/http';
import { identifierName } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatColumnDef, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort'
import { map, Observable } from 'rxjs';
import { Employee } from '../../shared/Employee';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employees-admin',
  templateUrl: './employees-admin.component.html',
  styleUrls: ['./employees-admin.component.css']
})
export class EmployeesAdminComponent implements OnInit {
  dataLoaded = false;
  showedTable = false;
  add = false;
  addedEmployee = false;
  nome = "";
  cognome = "";
  employeesData : Employee[] = [];
  dataSource: MatTableDataSource<Employee>;

  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'sex',
    'email',
    'phoneNumber',
    'taxCode',
    'active'
  ]

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  onSubmit(form: NgForm){
  }

  addEmployee(){
    this.add = !this.add;
    this.showedTable = !this.add;
  }

  onAddedEmployee(form: NgForm){
    if(!form.valid){
      return;
    }

    this.nome = form.value.name;
    this.cognome = form.value.lastName;

    let email = form.value.name + "." + form.value.lastName + "@energee3.com";
    email = email.toLowerCase();

    this.newEmployee(
      this.nome,
      this.cognome,
      form.value.sex,
      form.value.phone,
      email,
      form.value.fiscalCode,
      true
    );

  }

  getEmployees(){
    if (!this.dataLoaded){
      this.http.get(`${environment.apiURL}employees/findAll`)
      .pipe(
        map(responseData => {

          for (const key in responseData){
            if(responseData.hasOwnProperty(key)){
              this.employeesData.push({...responseData[key], id:key});
            }
          }

          this.dataSource = new MatTableDataSource(this.employeesData);
        })
      )
      .subscribe(posts => {
      })
    }
    this.dataLoaded = true;
    this.showedTable = true;
  }

  newEmployee(firstName, lastName, sex, phoneNumber, email, taxCode, active){
    this.http.post<Employee>(
      `${environment.apiURL}employees/newEmployee`,{
        firstName ,
        lastName,
        sex,
        phoneNumber,
        email,
        taxCode,
        active
      }
    ).subscribe(responseData => {
      console.log(responseData);
      this.addedEmployee = true;
    }, error => {
      console.log(error);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
