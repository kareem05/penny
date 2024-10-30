// apps/client/src/app/dashboard/components/data-filter.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-data-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  template: `
    <mat-form-field appearance="outline" class="w-full">
      <mat-label>Search</mat-label>
      <input matInput [formControl]="searchControl" placeholder="Search...">
      <mat-icon matSuffix>search</mat-icon>
    </mat-form-field>
  `
})
export class DataFilterComponent {
  @Output() filterChange = new EventEmitter<string>();
  searchControl = new FormControl('');

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.filterChange.emit(value || '');
    });
  }
}