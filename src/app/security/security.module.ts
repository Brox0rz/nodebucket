/**
 * Title: security.module.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 * Updated: 6/9/24 by Brock Hemsouvanh
*/

// imports statements
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SecurityRoutingModule } from './security-routing.module';
import { SecurityComponent } from './security.component';
import { SigninComponent } from './signin/signin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    SecurityComponent,
    SigninComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SecurityRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SecurityModule { }
