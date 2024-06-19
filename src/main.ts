/**
 * Title: main.ts
 * Author: Professor Richard Krasso and Brock Hemsouvanh
 * Date: 6/12/24
 * Description: Main entry point for the Nodebucket application
 */

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
