import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("AppComponent", () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AppComponent],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create the app", () => {
		expect(component).toBeTruthy();
	});
	it("isWindowVisible should be true", () => {
		component.toggleWindow("menu");
		expect(component.isWindowVisible).toBe(true);
		expect(component.menuMode).toBe("menu");

		component.toggleWindow("menu");
		expect(component.isWindowVisible).toBe(false);

		component.toggleWindow("draw");
		expect(component.isWindowVisible).toBe(true);
		expect(component.menuMode).toBe("draw");
	});

	it("getButtonClass should return active", () => {
		component.menuMode = "menu";
		component.isWindowVisible = true;
		expect(component.getButtonClass("menu")).toBe("active");

		component.menuMode = "draw";
		component.isWindowVisible = true;
		expect(component.getButtonClass("draw")).toBe("active");

		component.menuMode = "menu";
		component.isWindowVisible = false;
		expect(component.getButtonClass("menu")).toBe("");
	});

	it("should call toggleWindow when button is clicked", () => {
		spyOn(component, "toggleWindow");

		const button = fixture.debugElement.query(
			By.css(".side-nav-container__button"),
		);
		button.triggerEventHandler("click", null);
		expect(component.toggleWindow).toHaveBeenCalledWith("menu");
	});
});
