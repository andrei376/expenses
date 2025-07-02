import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Expense } from '../../models/expense.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  categories: Category[] = [];
  expenseForm: FormGroup;
  editingExpense: Expense | null = null;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.expenseForm = this.fb.group({
      category_id: ['', Validators.required],
      date: ['', Validators.required],
      cost: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadExpenses();
    this.loadCategories();
  }

  loadExpenses(): void {
    this.apiService.getExpenses().subscribe(
      expenses => this.expenses = expenses
    );
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe(
      categories => this.categories = categories
    );
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      const expense = this.expenseForm.value;
      if (this.editingExpense) {
        expense.id = this.editingExpense.id;
        this.apiService.updateExpense(expense).subscribe(() => {
          this.loadExpenses();
          this.resetForm();
        });
      } else {
        this.apiService.createExpense(expense).subscribe(() => {
          this.loadExpenses();
          this.resetForm();
        });
      }
    }
  }

  editExpense(expense: Expense): void {
    this.editingExpense = expense;
    this.expenseForm.patchValue(expense);
  }

  deleteExpense(id: number): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.apiService.deleteExpense(id).subscribe(() => {
        this.loadExpenses();
      });
    }
  }

  resetForm(): void {
    this.editingExpense = null;
    this.expenseForm.reset();
  }
}
