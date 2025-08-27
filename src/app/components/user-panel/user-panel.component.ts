import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseApiService } from '../../services/expense-api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="panel">
      <div class="head">
        <h3>{{ name() }}</h3>
        <button class="signout" (click)="onSignOut()">Sign out</button>
      </div>
      <div class="rows">
        <div class="income-row"><span>Income</span><span>{{ income() | number:'1.2-2' }}</span></div>
        <div><span>Expenses</span><span>{{ totalExpenses() | number:'1.2-2' }}</span></div>
        <div class="rem"><span>Remaining</span><span>{{ (income() - totalExpenses()) | number:'1.2-2' }}</span></div>
      </div>
    </div>
  `,
  styles: [
    `
    .panel { padding: .75rem; border: 1px solid #e5e7eb; border-radius: 12px; background:#fff; }
    .head { display:flex; align-items:center; justify-content:space-between; margin-bottom:.5rem; }
    .signout { padding:.35rem .6rem; border-radius:8px; border:1px solid #e5e7eb; background:#fff; cursor:pointer; }
    .rows { display:grid; gap:.25rem; }
    .rows > div { display:flex; justify-content:space-between; }
    .rem span:last-child { font-weight:600; color:#059669; }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPanelComponent {
  private readonly api = inject(ExpenseApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  userId = input<number>(1);
  name = signal('');
  income = signal(0);
  totalExpenses = signal(0);

  constructor() {
    effect(() => {
      const id = this.userId();
      if (id == null) return;
      const s1 = this.api.getUser(id).subscribe((u) => {
        this.name.set(u.fullName || u.email);
        this.income.set(u.income ?? 0);
      });
      const s2 = this.api.getExpenseTotalsByCategory(id).subscribe((rows) => {
        const sum = rows.reduce((acc, r) => acc + (r.total ?? 0), 0);
        this.totalExpenses.set(sum);
      });
      this.destroyRef.onDestroy(() => { s1.unsubscribe(); s2.unsubscribe(); });
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'expense-updated') {
          const id = this.userId();
          if (id != null) {
            this.api.getExpenseTotalsByCategory(id).subscribe((rows) => {
              const sum = rows.reduce((acc, r) => acc + (r.total ?? 0), 0);
              this.totalExpenses.set(sum);
            });
          }
        }
      });
    }
  }

  onSignOut() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  onIncomeChange(event: Event) { /* removed - income is read-only from DB */ }
}


