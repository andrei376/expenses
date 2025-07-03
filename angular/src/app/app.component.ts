import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
    title = 'Expense Tracker';
    currentYear: number = new Date().getFullYear();
    activeRoute: string = '';

    constructor(private router: Router) {}

    ngOnInit() {
        // Track current route for active navigation highlighting
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.activeRoute = event.url;
        });
    }

    // Helper method to check if a route is active
    isRouteActive(route: string): boolean {
        return this.activeRoute.startsWith(route);
    }

    // Navigation methods for better type safety and maintainability
    navigateTo(route: 'expenses' | 'categories' | 'summary') {
        this.router.navigate([`/${route}`]);
    }

    // Get page title based on current route
    getPageTitle(): string {
        switch (this.activeRoute) {
            case '/expenses':
                return 'Manage Expenses';
            case '/categories':
                return 'Manage Categories';
            case '/summary':
                return 'Expense Summary';
            default:
                return this.title;
        }
    }
}