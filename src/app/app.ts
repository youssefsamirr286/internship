import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet],
	template: `
	  <router-outlet />
	`,
})
export class AppComponent {
	// Keep minimal shell
}
