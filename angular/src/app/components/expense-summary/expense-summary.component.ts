import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

interface ExpenseSummary {
  category: string;
  transactionCount: number;
  totalCost: number;
}

interface GroupedExpenses {
  [year: number]: {
    [month: number]: ExpenseSummary[];
  };
}

@Component({
  selector: 'app-expense-summary',
  templateUrl: './expense-summary.component.html',
  styleUrls: ['./expense-summary.component.scss'],
  standalone: false
})
export class ExpenseSummaryComponent implements OnInit {
  groupedExpenses: GroupedExpenses = {};
  years: number[] = [];
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  selectedYear: number | null = null;
  selectedMonth: number | null = null;
  totalForPeriod: number = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadGroupedExpenses();
  }

  loadGroupedExpenses(): void {
    this.apiService.getExpensesGrouped().subscribe(data => {
      this.groupedExpenses = data;
      this.years = Object.keys(data).map(Number).sort((a, b) => b - a);
      if (this.years.length > 0) {
        this.selectedYear = this.years[0];
        this.updateTotalForPeriod();
      }
    });
  }

  selectYear(year: number): void {
    this.selectedYear = year;
    this.selectedMonth = null;
    this.updateTotalForPeriod();
  }

  selectMonth(month: number): void {
    this.selectedMonth = month;
    this.updateTotalForPeriod();
  }

  updateTotalForPeriod(): void {
    if (!this.selectedYear) return;

    let total = 0;
    const yearData = this.groupedExpenses[this.selectedYear];

    if (this.selectedMonth !== null) {
      // Calculate total for specific month
      const monthData = yearData[this.selectedMonth];
      if (monthData) {
        total = monthData.reduce((sum, item) => sum + item.totalCost, 0);
      }
    } else {
      // Calculate total for entire year
      Object.values(yearData).forEach(monthData => {
        total += monthData.reduce((sum, item) => sum + item.totalCost, 0);
      });
    }

    this.totalForPeriod = total;
  }

  getMonthData(): ExpenseSummary[] {
    if (!this.selectedYear || this.selectedMonth === null) return [];
    return this.groupedExpenses[this.selectedYear][this.selectedMonth] || [];
  }

  getYearData(): ExpenseSummary[] {
    if (!this.selectedYear) return [];

    const yearData = this.groupedExpenses[this.selectedYear];
    const combinedData: { [category: string]: ExpenseSummary } = {};

    Object.values(yearData).forEach(monthData => {
      monthData.forEach(item => {
        if (!combinedData[item.category]) {
          combinedData[item.category] = {
            category: item.category,
            transactionCount: 0,
            totalCost: 0
          };
        }
        combinedData[item.category].transactionCount += item.transactionCount;
        combinedData[item.category].totalCost += item.totalCost;
      });
    });

    return Object.values(combinedData);
  }
}
