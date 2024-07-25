import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DrawPolygonComponent } from "./draw-polygon.component";
import { DrawService } from "../../../../draw.service";
import { of, Subject } from "rxjs";
import {
	STROKE_STYLES,
	FILL_STYLES,
} from "../../../../consts/draw-consts.consts";
import { getTranslocoModule } from "src/app/modules/shared/transloco/transloco-testing.module";
import { DrawColorComponent } from "../../../draw-options/components/draw-color/draw-color.component";
import { DrawSizeComponent } from "../../../draw-options/components/draw-size/draw-size.component";
import { DrawTransparencyComponent } from "../../../draw-options/components/draw-transparency/draw-transparency.component";
import { DrawCoordinateInputComponent } from "../../../draw-options/components/draw-coordinate-input/draw-coordinate-input.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSliderModule } from "@angular/material/slider";
import { FormsModule } from "@angular/forms";

describe("DrawPolygonComponent", () => {
	let component: DrawPolygonComponent;
	let fixture: ComponentFixture<DrawPolygonComponent>;
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
				DrawPolygonComponent,
				DrawSizeComponent,
				DrawTransparencyComponent,
				DrawColorComponent,
				DrawCoordinateInputComponent,
			],
			providers: [{ provide: DrawService, useValue: mockDrawService }],
			imports: [
				getTranslocoModule(),
				MatDialogModule,
				MatSliderModule,
				FormsModule,
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DrawPolygonComponent);
		component = fixture.componentInstance;
		mockDrawService.getSize.and.returnValue(10);

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize polygonSize on ngOnInit", () => {
		component.ngOnInit();
		expect(mockDrawService.getSize).toHaveBeenCalledWith(component.tool);
		expect(component.polygonSize).toBe(10);
	});

	it("should set polygon fill style", async () => {
		const event = { target: { value: "fillStyle1" } } as unknown as Event;
		await component.setPolygonFillStyle(event);
		expect(mockDrawService.setFill).toHaveBeenCalledWith(
			component.tool,
			"fillStyle1",
		);
	});

	it("should set stroke style", async () => {
		const event = { target: { value: "strokeStyle1" } } as unknown as Event;
		await component.setStrokeStyle(event);
		expect(mockDrawService.setStrokeStyle).toHaveBeenCalledWith(
			component.tool,
			"strokeStyle1",
		);
	});

	it("should update polygon size", () => {
		spyOn(component.polygonSizeChange, "emit");
		component.polygonSize = 15;
		component.updatePolygonSize();
		expect(component.polygonSizeChange.emit).toHaveBeenCalledWith(15);
	});
});
