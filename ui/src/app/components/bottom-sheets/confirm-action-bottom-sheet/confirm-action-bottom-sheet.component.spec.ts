import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmActionBottomSheetComponent } from './confirm-action-bottom-sheet.component';

describe('ConfirmActionBottomSheetComponent', () => {
  let component: ConfirmActionBottomSheetComponent;
  let fixture: ComponentFixture<ConfirmActionBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmActionBottomSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmActionBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
