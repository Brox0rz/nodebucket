/**
 * Title: auth.guard.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 * Updated by Brock Hemsouvanh 06/07/2024
 */

// Import statements
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';  // corrected from express?
import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const cookie = inject(CookieService);

  if (cookie.get('session_user')) {
    return true;
  } else {
    const router = inject(Router);
    router.navigate(['/security/signin'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
