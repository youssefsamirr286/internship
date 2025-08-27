import { ChangeDetectionStrategy, Component, DestroyRef, PLATFORM_ID, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseApiService } from '../../services/expense-api.service';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-expense-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <canvas id="expenseBarChart" height="180"></canvas>
    </div>
  `,
  styles: [
    `
    .chart-container { width: 100%; max-width: 860px; margin: 1rem auto; }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseChartComponent {
  private readonly api = inject(ExpenseApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  // Allow passing the user id from route or parent; default demo: 1
  userId = input<number>(1);

  private chartInstance: Chart | null = null;
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = this.userId();
      if (id == null) return;
      this.loadChartData(id);
    });

    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('storage', (e) => {
        if (e.key === 'expense-updated') {
          const id = this.userId();
          if (id != null) this.loadChartData(id);
        }
      });
    }
  }

  private loadChartData(userId: number): void {
    // Avoid running during SSR
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const sub = this.api.getExpenseTotalsByCategory(userId).subscribe({
      next: (rows) => {
        const labels = rows.map((r) => r.categoryName);
        const data = rows.map((r) => r.total);
        this.renderBarChart(labels, data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load expenses');
        console.error(err);
        this.loading.set(false);
      },
    });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  private renderBarChart(labels: string[], data: number[]): void {
    const canvas = document.getElementById('expenseBarChart') as HTMLCanvasElement | null;
    if (!canvas) return;

    // cleanup
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: {
        labels,
        datasets: [
          {
            label: 'Expenses by Category',
            data,
            backgroundColor: '#ef4444',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: 'Category' } },
          y: { title: { display: true, text: 'Amount' }, beginAtZero: true },
        },
        plugins: {
          legend: { display: true },
          tooltip: { enabled: true },
        },
      },
    };

    this.chartInstance = new Chart(canvas.getContext('2d')!, config);
  }
}


