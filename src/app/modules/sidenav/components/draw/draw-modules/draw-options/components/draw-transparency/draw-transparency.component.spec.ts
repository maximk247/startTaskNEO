import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DrawTransparencyComponent } from "./draw-transparency.component";
import { DrawService } from "../../../../draw.service";
import { ColorService } from "../draw-color/draw-color.service";
import { of, Subject } from "rxjs";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

describe("DrawTransparencyComponent", () => {
	let component: DrawTransparencyComponent;
	let fixture: ComponentFixture<DrawTransparencyComponent>;
	let mockDrawService: jasmine.SpyObj<DrawService>;
	let mockColorService: jasmine.SpyObj<ColorService>;

	beforeEach(async () => {
		mockDrawService = jasmine.createSpyObj("DrawService", [
			"getAlpha",
			"getColor",
			"setColor",
		]);
		mockColorService = jasmine.createSpyObj("ColorService", ["setColor"]);

		await TestBed.configureTestingModule({
			declarations: [DrawTransparencyComponent],
			providers: [
				{ provide: DrawService, useValue: mockDrawService },
				{ provide: ColorService, useValue: mockColorService },
			],
			imports: [FormsModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DrawTransparencyComponent);
		component = fixture.componentInstance;
		component.tool = "testTool";
		component.type = "testType";

		mockDrawService.getAlpha.and.returnValue(0.5);
		mockDrawService.getColor.and.returnValue("rgba(255, 0, 0, 0.5)");
		mockDrawService.alphaChanged = new Subject<number>();
		mockDrawService.colorChanged = new Subject<string>();

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize with correct alpha value and color", () => {
		component.ngOnInit();
		expect(component.alphaValue).toBe(0.5);
		expect((component as any).currentColor).toBe("rgba(255, 0, 0, 0.5)");
	});

	it("should update alpha value on alphaChanged", () => {
		component.ngOnInit();
		mockDrawService.alphaChanged.next(0.8);
		expect(component.alphaValue).toBe(0.8);
	});

	it("should update color and alpha value on colorChanged", () => {
		component.ngOnInit();
		mockDrawService.colorChanged.next("rgba(0, 255, 0, 0.8)");
		expect((component as any).currentColor).toBe("rgba(0, 255, 0, 0.8)");
		expect(component.alphaValue).toBe(0.5);
	});

	it("should update color with alpha", () => {
		component.alphaValue = 0.7;
		component.updateColorWithAlpha();
		expect(mockDrawService.setColor).toHaveBeenCalledWith(
			"rgba(255, 0, 0, 0.7)",
			"testTool",
			"testType",
		);
		expect(mockColorService.setColor).toHaveBeenCalledWith(
			"rgba(255, 0, 0, 0.7)",
		);
	});

	it("should format slider value correctly", () => {
		expect(component.formatSliderValue(0.75)).toBe("75%");
		expect(component.formatSliderValue(0.1)).toBe("10%");
	});
});
