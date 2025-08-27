import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface TransactionDto {
  id: number;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  txnDate: string;
  category: { id: number; name: string };
  user: { id: number };
}

export interface CategorySpendDto {
  categoryName: string;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class ExpenseApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  getUserTransactions(userId: number): Observable<TransactionDto[]> {
    return this.http.get<TransactionDto[]>(`${this.baseUrl}/transactions/user/${userId}`);
  }

  getUser(userId: number) {
    return this.http.get<{ id: number; fullName: string; email: string; income: number; expenses: number }>(
      `${this.baseUrl}/users/${userId}`,
    );
  }

  updateIncome(userId: number, income: number) {
    return this.http.patch<{ id: number; income: number }>(
      `${this.baseUrl}/users/${userId}/income`,
      income,
      { headers: { 'Content-Type': 'application/json' } },
    );
  }

  getUserCategories(userId: number) {
    return this.http.get<Array<{ id: number; name: string }>>(
      `${this.baseUrl}/categories/user/${userId}`,
    );
  }

  createCategory(userId: number, name: string) {
    return this.http.post<{ id: number; name: string }>(
      `${this.baseUrl}/categories/user/${userId}`,
      { name },
    );
  }

  createExpense(userId: number, amount: number, categoryName: string) {
    const body = {
      amount,
      type: 'EXPENSE' as const,
      categoryName,
    } as const;
    console.log('API call - createExpense:', { url: `${this.baseUrl}/transactions/user/${userId}`, body });
    return this.http.post<TransactionDto>(`${this.baseUrl}/transactions/user/${userId}`, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getExpenseTotalsByCategory(userId: number): Observable<CategorySpendDto[]> {
    return this.getUserTransactions(userId).pipe(
      map((txns) =>
        txns
          .filter((t) => t.type === 'EXPENSE')
          .reduce<Record<string, number>>((acc, t) => {
            const name = t.category?.name ?? 'Uncategorized';
            acc[name] = (acc[name] ?? 0) + (t.amount ?? 0);
            return acc;
          }, {}),
      ),
      map((totalsMap) =>
        Object.entries(totalsMap).map(([categoryName, total]) => ({ categoryName, total })),
      ),
    );
  }
}


