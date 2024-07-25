import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DrawFreeLineComponent } from "./draw-free-line.component";
import { DrawService } from "../../../../draw.service";
import { FormsModule } from "@angular/forms";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { getTranslocoModule } from "src/app/modules/shared/transloco/transloco-testing.module";
import { DrawColorComponent } from "../../../draw-options/components/draw-color/draw-color.component";
import { DrawSizeComponent } from "../../../draw-options/components/draw-size/draw-size.component";
import { DrawTransparencyComponent } from "../../../draw-options/components/draw-transparency/draw-transparency.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSliderModule } from "@angular/material/slider";
import { Subject } from "rxjs";

describe("DrawFreeLineComponent", () => {
	let component: DrawFreeLineComponent;
	let fixture: ComponentFixture<DrawFreeLineComponent>;
	let mockDrawService: jasmine.SpyObj<DrawService>;
	let alphaChangedSubject: Subject<number>;
	let colorChangedSubject: Subject<string>;

	beforeEach(async () => {
		alphaChangedSubject = new Subject<number>();
		colorChangedSubject = new Subject<string>();

		mockDrawService = jasmine.createSpyObj(
			"DrawService",
			[
				"getSize",
				"setFill",
				"setStrokeStyle",
				"getColor",
				"getAlpha",
				"setColor",
			],
			{
				alphaChanged: alphaChangedSubject.asObservable(),
				colorChanged: colorChangedSubject.asObservable(),
			},
		);

		await TestBed.configureTestingModule({
			declarations: [
				DrawFreeLineComponent,
				DrawSizeComponent,
				DrawTransparencyComponent,
				DrawColorComponent,
			],
			providers: [{ provide: DrawService, useValue: mockDrawService }],
			imports: [
				FormsModule,
				getTranslocoModule(),
				MatDialogModule,
				MatSliderModule,
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DrawFreeLineComponent);
		component = fixture.componentInstance;
		component.tool = "freeLineTool";

		mockDrawService.getSize.and.returnValue(5);

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize free line size on ngOnInit", () => {
		component.ngOnInit();
		expect(mockDrawService.getSize).toHaveBeenCalledWith("freeLineTool");
		expect(component.freeLineSize).toBe(5);
	});

	it("should set stroke style", () => {
		const event = {
			target: { value: "dashed" },
		} as unknown as Event;

		component.setStrokeStyle(event);
		expect(mockDrawService.setStrokeStyle).toHaveBeenCalledWith(
			"freeLineTool",
			"dashed",
		);
	});

	it("should emit free line size change", () => {
		spyOn(component.freeLineSizeChange, "emit");
		component.freeLineSize = 10;

		component.updateLineSize();

		expect(component.freeLineSizeChange.emit).toHaveBeenCalledWith(10);
	});
});
