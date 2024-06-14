/**
 * Title: home.component.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 * Updated by Brock Hemsouvanh on 6/13/24
 * Description: Home component logic for the Nodebucket application
 */

// imports statements
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  empId: string = '';

  constructor(private router: Router) {}

  onSignIn() {
    // Logic to handle sign in, such as routing to the sign-in page or verifying the employee ID
    if (this.empId) {
      this.router.navigate(['/tasks']); // Navigate to tasks after sign in
    }
  }
}
