import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawDeleteAllComponent } from './draw-delete-all.component';

describe('DrawDeleteAllComponent', () => {
  let component: DrawDeleteAllComponent;
  let fixture: ComponentFixture<DrawDeleteAllComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DrawDeleteAllComponent]
    });
    fixture = TestBed.createComponent(DrawDeleteAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
