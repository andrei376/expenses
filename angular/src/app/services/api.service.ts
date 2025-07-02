import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { Expense } from '../models/expense.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private headers = new HttpHeaders().set('x-api-key', 'your-secret-api-key');

  constructor(private http: HttpClient) {}

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories`, { headers: this.headers });
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${environment.apiUrl}/categories`, category, { headers: this.headers });
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${environment.apiUrl}/categories/${category.id}`, category, { headers: this.headers });
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/categories/${id}`, { headers: this.headers });
  }

  // Expenses
  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${environment.apiUrl}/expenses`, { headers: this.headers });
  }

  createExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(`${environment.apiUrl}/expenses`, expense, { headers: this.headers });
  }

  updateExpense(expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${environment.apiUrl}/expenses/${expense.id}`, expense, { headers: this.headers });
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/expenses/${id}`, { headers: this.headers });
  }

  getExpensesGrouped(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/expenses/grouped`, { headers: this.headers });
  }
}
