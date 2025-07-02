import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { ExpenseSummaryComponent } from './components/expense-summary/expense-summary.component';

import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    ExpensesComponent,
    ExpenseSummaryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: 'categories', component: CategoriesComponent },
      { path: 'expenses', component: ExpensesComponent },
      { path: 'summary', component: ExpenseSummaryComponent },
      { path: '', redirectTo: '/expenses', pathMatch: 'full' }
    ])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
