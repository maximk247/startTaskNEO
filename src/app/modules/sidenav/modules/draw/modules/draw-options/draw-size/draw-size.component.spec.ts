import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DrawSizeComponent } from "./draw-size.component";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";

describe("DrawSizeComponent", () => {
	let component: DrawSizeComponent;
	let fixture: ComponentFixture<DrawSizeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DrawSizeComponent],
			imports: [FormsModule],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DrawSizeComponent);
		component = fixture.componentInstance;
		component.size = 5;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should decrease size", () => {
		component.decreaseSize();
		expect(component.size).toBe(4);
	});

	it("should not decrease size below minSize", () => {
		component.size = 1;
		component.decreaseSize();
		expect(component.size).toBe(1);
	});

	it("should increase size", () => {
		component.increaseSize();
		expect(component.size).toBe(6);
	});

	it("should emit sizeChange when size is increased", () => {
		spyOn(component.sizeChange, "emit");
		component.increaseSize();
		expect(component.sizeChange.emit).toHaveBeenCalledWith(6);
	});

	it("should emit sizeChange when size is decreased", () => {
		spyOn(component.sizeChange, "emit");
		component.decreaseSize();
		expect(component.sizeChange.emit).toHaveBeenCalledWith(4);
	});

	it("should update size when input value changes", () => {
		const input = fixture.debugElement.query(By.css("input")).nativeElement;
		input.value = "10";
		input.dispatchEvent(new Event("input"));
		fixture.detectChanges();
		input.dispatchEvent(new Event("change"));
		expect(component.size).toBe(10);
	});

	it("should call updateSize on input change", () => {
		spyOn(component, "updateSize");
		const input = fixture.debugElement.query(By.css("input")).nativeElement;
		input.dispatchEvent(new Event("change"));
		expect(component.updateSize).toHaveBeenCalled();
	});

	it("should decrease size when - button is clicked", () => {
		const button = fixture.debugElement.query(
			By.css("button:first-of-type"),
		).nativeElement;
		button.click();
		expect(component.size).toBe(4);
	});

	it("should increase size when + button is clicked", () => {
		const button = fixture.debugElement.query(
			By.css("button:last-of-type"),
		).nativeElement;
		button.click();
		expect(component.size).toBe(6);
	});
});
