import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DrawDeleteOnClickComponent } from "./draw-delete-on-click.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("DrawDeleteOnClickComponent", () => {
	let component: DrawDeleteOnClickComponent;
	let fixture: ComponentFixture<DrawDeleteOnClickComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [DrawDeleteOnClickComponent],
			schemas: [NO_ERRORS_SCHEMA],
		});
		fixture = TestBed.createComponent(DrawDeleteOnClickComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
