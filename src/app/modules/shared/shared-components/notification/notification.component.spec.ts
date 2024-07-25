import { ComponentFixture, TestBed, fakeAsync, flush } from "@angular/core/testing";
import { NotificationComponent } from "./notification.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("NotificationComponent", () => {
	let component: NotificationComponent;
	let fixture: ComponentFixture<NotificationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NotificationComponent],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NotificationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should show notification with a message", fakeAsync(() => {
		const message = "Test message";
		component.show(message);
		fixture.detectChanges();
		expect(component.message).toBe(message);
		expect(component.isVisible).toBeTrue();

		flush(); 
		fixture.detectChanges();
		expect(component.isVisible).toBeFalse();
	}));

	it("should hide notification after timeout", fakeAsync(() => {
		const message = "Test message";
		component.show(message);
		fixture.detectChanges();
		expect(component.isVisible).toBeTrue();

		flush();
		expect(component.isVisible).toBeFalse();
		expect(component.message).toBe("");
	}));

	it("should close notification", fakeAsync(() => {
		component.show("Test message");
		fixture.detectChanges();

		component.close();
		expect(component.isVisible).toBeFalse();

		flush();
		expect(component.message).toBe("");
	}));
});
