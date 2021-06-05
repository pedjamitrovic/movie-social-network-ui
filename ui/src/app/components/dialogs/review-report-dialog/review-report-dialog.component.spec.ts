import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewReportDialogComponent } from './review-report-dialog.component';

describe('ReviewReportDialogComponent', () => {
  let component: ReviewReportDialogComponent;
  let fixture: ComponentFixture<ReviewReportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewReportDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
