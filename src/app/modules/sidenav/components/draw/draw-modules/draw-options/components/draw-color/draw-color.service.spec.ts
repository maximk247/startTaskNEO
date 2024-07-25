import { TestBed } from "@angular/core/testing";
import { ColorService } from "./draw-color.service";

describe("ColorService", () => {
	let service: ColorService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ColorService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});

	it("should have initial color as 'rgba(0, 0, 0, 1)'", (done) => {
		service.color$.subscribe((color: any) => {
			expect(color).toBe("rgba(0, 0, 0, 1)");
			done();
		});
	});

	it("should change color when setColor is called", (done) => {
		const newColor = "rgba(255, 0, 0, 1)";
		service.setColor(newColor);
		service.color$.subscribe((color: any) => {
			expect(color).toBe(newColor);
			done();
		});
	});
});
