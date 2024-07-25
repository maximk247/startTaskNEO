import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DrawFreePolygonComponent } from "./draw-free-polygon.component";
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

describe("DrawFreePolygonComponent", () => {
	let component: DrawFreePolygonComponent;
	let fixture: ComponentFixture<DrawFreePolygonComponent>;
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
				DrawFreePolygonComponent,
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
		fixture = TestBed.createComponent(DrawFreePolygonComponent);
		component = fixture.componentInstance;
		component.tool = "freePolygonTool";

		mockDrawService.getSize.and.returnValue(5);

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize free polygon size on ngOnInit", () => {
		component.ngOnInit();
		expect(mockDrawService.getSize).toHaveBeenCalledWith("freePolygonTool");
		expect(component.freePolygonSize).toBe(5);
	});

	it("should set fill style", async () => {
		const event = {
			target: { value: "solid" },
		} as unknown as Event;

		await component.setFreePolygonFillStyle(event);
		expect(mockDrawService.setFill).toHaveBeenCalledWith(
			"freePolygonTool",
			"solid",
		);
	});

	it("should set stroke style", () => {
		const event = {
			target: { value: "dashed" },
		} as unknown as Event;

		component.setStrokeStyle(event);
		expect(mockDrawService.setStrokeStyle).toHaveBeenCalledWith(
			"freePolygonTool",
			"dashed",
		);
	});

	it("should emit free polygon size change", () => {
		spyOn(component.freePolygonSizeChange, "emit");
		component.freePolygonSize = 10;

		component.updateFreePolygonSize();

		expect(component.freePolygonSizeChange.emit).toHaveBeenCalledWith(10);
	});
});
