// apps/client/src/app/dashboard/components/data-export.component.ts
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-data-export',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <button mat-raised-button color="primary" (click)="exportToExcel()">
      <mat-icon>download</mat-icon>
      Export to Excel
    </button>
  `
})
export class DataExportComponent {
  @Input() data: any[] = [];
  @Input() fileName: string = 'export';

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${this.fileName}_${new Date().toISOString()}.xlsx`);
  }
}