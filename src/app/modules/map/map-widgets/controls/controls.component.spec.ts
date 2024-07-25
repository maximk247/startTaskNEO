import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ControlsComponent } from "./controls.component";
import { ScaleBarComponent } from "../scale-bar/scale-bar.component";
import { SliderComponent } from "../slider/slider.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("ControlsComponent", () => {
	let component: ControlsComponent;
	let fixture: ComponentFixture<ControlsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ControlsComponent, ScaleBarComponent, SliderComponent],
            schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ControlsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
