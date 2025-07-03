import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  standalone: false
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  categoryForm: FormGroup;
  editingCategory: Category | null = null;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe(
      categories => this.categories = categories
    );
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const category = this.categoryForm.value;
      if (this.editingCategory) {
        category.id = this.editingCategory.id;
        this.apiService.updateCategory(category).subscribe(() => {
          this.loadCategories();
          this.resetForm();
        });
      } else {
        this.apiService.createCategory(category).subscribe(() => {
          this.loadCategories();
          this.resetForm();
        });
      }
    }
  }

  editCategory(category: Category): void {
    this.editingCategory = category;
    this.categoryForm.patchValue(category);
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.apiService.deleteCategory(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }

  resetForm(): void {
    this.editingCategory = null;
    this.categoryForm.reset();
  }
}
