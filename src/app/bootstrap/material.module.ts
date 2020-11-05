import {NgModule} from '@angular/core';

import {
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatListModule,
  MatFormFieldModule,
  MatRadioModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatInputModule,
  MatTableModule,
  MatExpansionModule,
  MatSelectModule,
  MatButtonModule,
  MatGridListModule,
  MatButtonToggleModule,
  MatTabsModule,
  MatMenuModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatDividerModule
} from '@angular/material';

import {
  DragDropModule
}  from '@angular/cdk/drag-drop'

@NgModule({
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatInputModule,
    MatTableModule,
    MatExpansionModule,
    MatSelectModule,
    MatButtonModule,
    MatGridListModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatMenuModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    DragDropModule
],
  exports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatInputModule,
    MatTableModule,
    MatExpansionModule,
    MatSelectModule,
    MatButtonModule,
    MatGridListModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatMenuModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    DragDropModule
  ]
})
export class MaterialModule {}