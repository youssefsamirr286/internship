import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseChartComponent } from '../components/expense-chart/expense-chart.component';
import { ExpenseEntryComponent } from '../components/expense-entry/expense-entry.component';
import { ExpenseTotalsComponent } from '../components/expense-totals/expense-totals.component';
import { UserPanelComponent } from '../components/user-panel/user-panel.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ExpenseChartComponent, ExpenseEntryComponent, ExpenseTotalsComponent, UserPanelComponent],
  template: `
    <div class="dash">
      <div class="left">
        <app-user-panel [userId]="userId()" />
        <app-expense-entry [userId]="userId()" />
      </div>
      <div class="right">
        <app-expense-chart [userId]="userId()" />
        <app-expense-totals [userId]="userId()" />
      </div>
    </div>
  `,
  styles: [
    `
    .dash { display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; align-items:start; }
    .left, .right { min-height: 300px; display:grid; gap:1rem; }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  userId = input<number>(this.auth.userId() ?? 1);
}


