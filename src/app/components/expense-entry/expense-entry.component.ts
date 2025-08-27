import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ExpenseApiService } from '../../services/expense-api.service';

@Component({
  selector: 'app-expense-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="wrap">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid">
        <div>
          <label>Amount</label>
          <input type="number" formControlName="amount" min="0" step="0.01" />
        </div>
        <div>
          <label>Category</label>
          <input type="text" formControlName="categoryName" placeholder="e.g. Groceries" />
        </div>
        <div class="actions">
          <button type="submit" [disabled]="form.invalid || loading()">{{ loading() ? 'Saving…' : 'Add Expense' }}</button>
        </div>
      </form>
      <div class="row" style="display:none"></div>
      <p class="err" *ngIf="error()">{{ error() }}</p>
      <p class="ok" *ngIf="ok()">Saved</p>
    </div>
  `,
  styles: [
    `
    .wrap { max-width: 860px; margin: 0; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; }
    .grid { display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: .5rem; align-items: end; }
    .grid > div { display: grid; gap: .25rem; }
    label { font-size: .85rem; color: #374151; }
    input, select { padding: .55rem .6rem; border: 1px solid #d1d5db; border-radius: 8px; }
    .actions { display:flex; align-items:end; }
    button { padding: .5rem .75rem; border-radius: 8px; background:#111827; color:#fff; border:none; cursor:pointer; }
    .row { margin-top: .75rem; display: flex; gap: .5rem; }
    .err { color:#b91c1c; margin-top:.5rem; }
    .ok { color:#059669; margin-top:.5rem; }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseEntryComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ExpenseApiService);
  private readonly destroyRef = inject(DestroyRef);

  userId = input<number>(1);

  loading = signal(false);
  error = signal<string | null>(null);
  ok = signal(false);
  categories = signal<Array<{ id: number; name: string }>>([]);

  form = this.fb.group({
    amount: [0, [Validators.required, Validators.min(0.01)]],
    categoryName: ['', [Validators.required]],
  });

  constructor() {}

  private loadCategories(userId: number) { /* no-op: categories removed */ }

  addCategory() { /* removed */ }

  onCategoryNameInput(event: Event) { /* removed */ }

  onSubmit() {
    if (this.form.invalid) return;
    const id = this.userId();
    const { amount, categoryName } = this.form.getRawValue();
    this.loading.set(true);
    this.error.set(null);
    this.ok.set(false);
    
    // Log the request for debugging
    console.log('Sending expense request:', { amount, categoryName, userId: id });
    
    const sub = this.api.createExpense(id, Number(amount), String(categoryName)).subscribe({
      next: (response) => {
        console.log('Expense saved successfully:', response);
        this.loading.set(false);
        this.ok.set(true);
        this.form.reset();
        // emit storage event to notify chart to refresh
        try { localStorage.setItem('expense-updated', String(Date.now())); } catch {}
      },
      error: (e) => {
        console.error('Expense save error:', e);
        this.loading.set(false);
        this.error.set(`Failed to save expense: ${e.status} - ${e.message || 'Unknown error'}`);
      },
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}


