/*
 *  Protractor support is deprecated in Angular.
 *  Protractor is used in this example for compatibility with Angular documentation tools.
 */
import {bootstrapApplication, provideProtractorTestingSupport} from '@angular/platform-browser';
import { platformBrowser } from '@angular/platform-browser';

// import {App} from './app/app';
import { AppModule } from './app/app.module';

platformBrowser().bootstrapModule(AppModule, {providers: [provideProtractorTestingSupport()]}).catch((err) =>
  console.error(err),
);

// platformBrowserDynamic().bootstrapModule(AppModule)
//     .catch(err => console.error(err));