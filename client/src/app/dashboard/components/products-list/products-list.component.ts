import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  template: `
    <mat-card>
      <mat-card-content>
        <table mat-table [dataSource]="products">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let product">{{product.name}}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="['name']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['name'];"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `
})
export class ProductsListComponent {
  @Input() products: any[] = [];
  @Input() loading = false;
  @Input() error: any = null;
  @Output() retry = new EventEmitter<void>();
}
