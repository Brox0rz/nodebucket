/**
 * Title: app-routing.module.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 * Updated by Brock Hemsouvanh 6/21/2024
 */

// imports statements
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './shared/auth.guard';
import { TasksComponent } from './tasks/tasks.component';
import { ContactComponent } from './contact/contact.component';
import { SigninComponent } from './security/signin/signin.component';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

// routes array with a path, component, and title for each route in the application (e.g. home, about, contact, etc.)
const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'Nodebucket: Home' // title for the home page
      },
      {
        path: 'home',
        component: HomeComponent,
        title: 'Nodebucket: Home'
      },
      {
        path: 'tasks',
        component: TasksComponent,
        canActivate: [ authGuard ],
      },
      {
        path: 'contact',
        component: ContactComponent,
      },
      {
        path: 'security/signin',
        component: SigninComponent,
        title: 'Nodebucket: Sign In'
      },
      {
        path: 'about',
        component: AboutComponent,
        title: 'Nodebucket: About'
      },
      {
        path: '404',
        component: PageNotFoundComponent,
        title: 'Nodebucket: 404 Not Found'
      },
      {
        path: '**',
        redirectTo: '/404'
      }
    ]
  },
  {
    // path for the security module (e.g. login, register, forgot password, etc.)
    path: 'security',
    loadChildren: () => import('./security/security.module').then(m => m.SecurityModule)
  }
];

@NgModule({
  // imports the RouterModule and defines the routes array and other options (e.g. useHash, enableTracing, scrollPositionRestoration)
  imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false, scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
