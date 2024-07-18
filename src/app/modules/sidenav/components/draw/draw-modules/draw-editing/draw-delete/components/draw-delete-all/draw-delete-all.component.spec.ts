import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DrawDeleteAllComponent } from "./draw-delete-all.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("DrawDeleteAllComponent", () => {
	let component: DrawDeleteAllComponent;
	let fixture: ComponentFixture<DrawDeleteAllComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [DrawDeleteAllComponent],
			schemas: [NO_ERRORS_SCHEMA],
		});
		fixture = TestBed.createComponent(DrawDeleteAllComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
