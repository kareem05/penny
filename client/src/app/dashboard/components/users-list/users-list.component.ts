// apps/client/src/app/dashboard/components/users-list.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  template: `
    <mat-card>
      <mat-card-content>
        <mat-list>
          <mat-list-item *ngFor="let user of users">
            {{ user.name }} - {{ user.email }}
          </mat-list-item>
        </mat-list>
      </mat-card-content>
    </mat-card>
  `
})
export class UsersListComponent {
  @Input() users: any[] = [];
  @Input() loading = false;
  @Input() error: any = null;
  @Output() retry = new EventEmitter<void>();
}
