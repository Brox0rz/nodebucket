/**
 * Title: security.service.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 * Updated: 6/9/24 by Brock Hemsouvanh
 * Description: Security service for handling employee authentication
 */

// imports
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  // constructor with http parameter
  constructor(private http: HttpClient) { }

  findEmployeeById(empId: number) {
    return this.http.get('/api/employees/' + empId); // returns the employee by empId from the database
  }
}
