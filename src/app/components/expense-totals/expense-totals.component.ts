import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseApiService, CategorySpendDto } from '../../services/expense-api.service';

@Component({
  selector: 'app-expense-totals',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="totals">
      <h3>Totals by category</h3>
      <ul>
        <li *ngFor="let row of totals()">
          <span class="name">{{ row.categoryName }}</span>
          <span class="amt">{{ row.total | number:'1.2-2' }}</span>
        </li>
      </ul>
    </div>
  `,
  styles: [
    `
    .totals { margin-top: .75rem; padding: .75rem; border: 1px solid #e5e7eb; border-radius: 12px; background:#fff; }
    h3 { margin: 0 0 .5rem; font-size: 1rem; }
    ul { list-style: none; padding: 0; margin: 0; display: grid; gap: .35rem; }
    li { display: flex; justify-content: space-between; }
    .name { color: #374151; }
    .amt { font-weight: 600; }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseTotalsComponent {
  private readonly api = inject(ExpenseApiService);
  private readonly destroyRef = inject(DestroyRef);

  userId = input<number>(1);
  totals = signal<CategorySpendDto[]>([]);

  constructor() {
    effect(() => {
      const id = this.userId();
      if (id == null) return;
      const sub = this.api.getExpenseTotalsByCategory(id).subscribe({
        next: (rows) => this.totals.set(rows),
      });
      this.destroyRef.onDestroy(() => sub.unsubscribe());
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'expense-updated') {
          const id = this.userId();
          if (id != null) {
            this.api.getExpenseTotalsByCategory(id).subscribe((rows) => this.totals.set(rows));
          }
        }
      });
    }
  }
}


