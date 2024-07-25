import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DrawFigureComponent } from "./draw-figure.component";
import { DrawService } from "../../../../draw.service";
import { FormsModule } from "@angular/forms";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {
	FILL_STYLES,
	STROKE_STYLES,
} from "../../../../consts/draw-consts.consts";
import { getTranslocoModule } from "src/app/modules/shared/transloco/transloco-testing.module";
import { DrawColorComponent } from "../../../draw-options/components/draw-color/draw-color.component";
import { DrawSizeComponent } from "../../../draw-options/components/draw-size/draw-size.component";
import { DrawTransparencyComponent } from "../../../draw-options/components/draw-transparency/draw-transparency.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSliderModule } from "@angular/material/slider";
import { Subject } from "rxjs";

describe("DrawFigureComponent", () => {
	let component: DrawFigureComponent;
	let fixture: ComponentFixture<DrawFigureComponent>;
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
				DrawFigureComponent,
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
		fixture = TestBed.createComponent(DrawFigureComponent);
		component = fixture.componentInstance;
		component.tool = "figureTool";

		mockDrawService.getSize.and.returnValue(10);

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize figure size on ngOnInit", () => {
		component.ngOnInit();
		expect(mockDrawService.getSize).toHaveBeenCalledWith("figureTool");
		expect(component.figureSize).toBe(10);
	});

	it("should set figure fill style", async () => {
		const event = {
			target: { value: "solid" },
		} as unknown as Event;

		await component.setFigureFillStyle(event);
		expect(mockDrawService.setFill).toHaveBeenCalledWith("figureTool", "solid");
	});

	it("should set stroke style", () => {
		const event = {
			target: { value: "dashed" },
		} as unknown as Event;

		component.setStrokeStyle(event);
		expect(mockDrawService.setStrokeStyle).toHaveBeenCalledWith(
			"figureTool",
			"dashed",
		);
	});

	it("should emit figure size change", () => {
		spyOn(component.figureSizeChange, "emit");
		component.figureSize = 20;

		component.updateFigureSize();

		expect(component.figureSizeChange.emit).toHaveBeenCalledWith(20);
	});
});
