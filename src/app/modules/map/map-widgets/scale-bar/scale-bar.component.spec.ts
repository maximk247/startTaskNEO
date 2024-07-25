import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ScaleBarComponent } from "./scale-bar.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("ScaleBarComponent", () => {
	let component: ScaleBarComponent;
	let fixture: ComponentFixture<ScaleBarComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ScaleBarComponent],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ScaleBarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
