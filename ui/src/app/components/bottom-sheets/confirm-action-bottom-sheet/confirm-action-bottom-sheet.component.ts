import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

export interface ConfirmActionBottomSheetComponentData {
  text?: string;
}

@Component({
  selector: 'app-confirm-action-bottom-sheet',
  templateUrl: './confirm-action-bottom-sheet.component.html',
  styleUrls: ['./confirm-action-bottom-sheet.component.scss']
})
export class ConfirmActionBottomSheetComponent implements OnInit {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ConfirmActionBottomSheetComponentData,
    private bottomSheetRef: MatBottomSheetRef<ConfirmActionBottomSheetComponent, boolean>
  ) { }

  ngOnInit() {

  }

  discard() {
    this.bottomSheetRef.dismiss(false);
  }

  confirm() {
    this.bottomSheetRef.dismiss(true);
  }

}
