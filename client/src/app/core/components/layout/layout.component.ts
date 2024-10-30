import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="layout-container">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .layout-container {
      min-height: 100vh;
    }
  `]
})
export class LayoutComponent {}
