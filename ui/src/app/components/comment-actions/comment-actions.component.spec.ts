import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentActionsComponent } from './comment-actions.component';

describe('ComponentActionsComponent', () => {
  let component: CommentActionsComponent;
  let fixture: ComponentFixture<CommentActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});