import { Routes } from '@angular/router';
import { ExpenseChartComponent } from './components/expense-chart/expense-chart.component';
import { LoginComponent } from './components/auth/login.component';
import { SignupComponent } from './components/auth/signup.component';
import { ExpenseEntryComponent } from './components/expense-entry/expense-entry.component';
import { DashboardComponent } from './pages/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'expenses', component: ExpenseChartComponent },
  { path: 'add', component: ExpenseEntryComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];
