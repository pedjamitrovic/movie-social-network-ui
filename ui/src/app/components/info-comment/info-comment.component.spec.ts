import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCommentComponent } from './info-comment.component';

describe('InfoCommentComponent', () => {
  let component: InfoCommentComponent;
  let fixture: ComponentFixture<InfoCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
