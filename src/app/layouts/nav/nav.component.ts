/**
 * Title: nav.component.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 * Updated: 6/9/24 by Brock Hemsouvanh
 */

// Import statements
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

// AppUser interface with fullName property
export interface AppUser {
  fullName: string;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  appUser: AppUser;
  isSignedIn: boolean;

  // Constructor with cookieService and router dependencies
  constructor(private cookieService: CookieService, private router: Router) {
    this.isSignedIn = this.cookieService.get('session_user') ? true : false;  // Check if the user is signed in
    this.appUser = {} as AppUser;

    // If the user is signed in, set the appUser object to the session name
    if (this.isSignedIn) {
      this.appUser = {
        fullName: this.cookieService.get('session_name')
      }
      console.log('Signed in as', this.appUser.fullName);
    }
  }

  // Signout function to clear the session cookie
  signout() {
    console.log('Clearing cookies');
    this.cookieService.deleteAll();  // Delete all cookies
    window.location.href = '/';  // Redirect to the home page
  }
}
