// apps/client/src/app/dashboard/components/data-table.component.ts
import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { DataFilterComponent } from './data-filter.component';
import { DataExportComponent } from './data-export.component';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    DataFilterComponent,
    DataExportComponent
  ],
  template: `
    <div class="mat-elevation-z8">
      <app-data-filter (filterChange)="applyFilter($event)"></app-data-filter>

      <table mat-table [dataSource]="dataSource" matSort>
        <ng-container *ngFor="let column of columns" [matColumnDef]="column.key">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            {{ column.label }}
          </th>
          <td mat-cell *matCellDef="let element">
            {{ element[column.key] }}
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell" colspan="4">No data matching the filter</td>
        </tr>
      </table>

      <mat-paginator 
        [pageSizeOptions]="[5, 10, 25, 100]"
        showFirstLastButtons>
      </mat-paginator>
    </div>

    <div class="export-section">
      <app-data-export 
        [data]="dataSource.data" 
        [fileName]="tableName">
      </app-data-export>
    </div>
  `,
  styles: [`
    .export-section {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class DataTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: Array<{key: string, label: string}> = [];
  @Input() tableName: string = '';
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = [];

  ngOnInit() {
    this.displayedColumns = this.columns.map(col => col.key);
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}