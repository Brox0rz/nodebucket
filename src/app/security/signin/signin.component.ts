/**
 * Title: signin.component.ts
 * Author: Professor Richard Krasso and Brock Hemsouvanh
 * Date: 6/5/24
 * Description: Signin component for handling employee sign-in functionality in Nodebucket application
 */

import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SecurityService } from '../security.service';

export interface SessionUser {
  empId: number;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  errorMessage: string;
  sessionUser: SessionUser;
  isLoading: boolean = false;

  signinForm = this.fb.group({
    empId: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cookieService: CookieService,
    private securityService: SecurityService,
    private route: ActivatedRoute
  ) {
    this.errorMessage = '';
    this.sessionUser = {} as SessionUser;
  }

  signin() {
    this.isLoading = true;

    const empId = this.signinForm.controls['empId'].value;

    if (!empId || isNaN(parseInt(empId, 10))) {
      this.errorMessage = 'The employee ID is invalid.';
      this.isLoading = false;
      return;
    }

    this.securityService.findEmployeeById(empId).subscribe({
      next: (employee: any) => {
        this.sessionUser = employee;
        this.cookieService.set('session_user', empId, 1);
        this.cookieService.set('session_name', `${employee.firstName} ${employee.lastName}`, 1);

        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';

        this.isLoading = false;

        this.router.navigate([returnUrl]);
      },
      error: (err) => {
        this.errorMessage = 'Failed to sign in. Please try again.';
        this.isLoading = false;

        // Improved error handling
        if (err && err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = err.message;
        }
      }
    });
  }
}
