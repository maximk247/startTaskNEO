import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawDeleteOnClickComponent } from './draw-delete-on-click.component';

describe('DrawDeleteOnClickComponent', () => {
  let component: DrawDeleteOnClickComponent;
  let fixture: ComponentFixture<DrawDeleteOnClickComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DrawDeleteOnClickComponent]
    });
    fixture = TestBed.createComponent(DrawDeleteOnClickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
