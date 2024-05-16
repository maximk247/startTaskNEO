import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawShapeComponent } from './draw-shape.component';

describe('DrawShapeComponent', () => {
  let component: DrawShapeComponent;
  let fixture: ComponentFixture<DrawShapeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DrawShapeComponent]
    });
    fixture = TestBed.createComponent(DrawShapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
