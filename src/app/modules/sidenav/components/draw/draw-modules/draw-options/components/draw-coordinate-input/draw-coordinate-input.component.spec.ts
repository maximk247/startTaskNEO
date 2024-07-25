import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DrawCoordinateInputComponent } from "./draw-coordinate-input.component";
import {
	FormBuilder,
	FormsModule,
	ReactiveFormsModule,
	FormArray,
	FormGroup,
} from "@angular/forms";
import { TranslocoService } from "@ngneat/transloco";
import { MapService } from "src/app/modules/map/map.service";
import { DrawService } from "../../../../draw.service";
import { NotificationComponent } from "src/app/modules/shared/shared-components/notification/notification.component";
import { SpatialReference } from "src/app/modules/shared/interfaces/spatial-reference.interfaces";
import { DrawTools, ProjectionType } from "../../enum/draw-options.enum";
import { HttpClientModule } from "@angular/common/http";
import { getTranslocoModule } from "src/app/modules/shared/transloco/transloco-testing.module";
import { CoordinateSystemComponent } from "src/app/modules/shared/shared-components/coordinate-system-selector/coordinate-system.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Style } from "ol/style";

describe("DrawCoordinateInputComponent", () => {
	let component: DrawCoordinateInputComponent;
	let fixture: ComponentFixture<DrawCoordinateInputComponent>;
	let mapServiceStub: Partial<MapService>;
	let drawServiceStub: Partial<DrawService>;

	beforeEach(async () => {
		mapServiceStub = {
			addFeatureToMap: jasmine.createSpy("addFeatureToMap"),
		};

		drawServiceStub = {
			getStyle: jasmine
				.createSpy("getStyle")
				.and.returnValue(Promise.resolve(new Style())),
			addText: jasmine.createSpy("addText"),
		};

		await TestBed.configureTestingModule({
			declarations: [
				DrawCoordinateInputComponent,
				NotificationComponent,
				CoordinateSystemComponent,
			],
			providers: [
				{ provide: MapService, useValue: mapServiceStub },
				{ provide: DrawService, useValue: drawServiceStub },
				FormBuilder,
			],
			imports: [
				getTranslocoModule(),
				FormsModule,
				HttpClientModule,
				ReactiveFormsModule,
			],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();

		fixture = TestBed.createComponent(DrawCoordinateInputComponent);

		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize form on ngOnInit", () => {
		component.ngOnInit();
		expect(component.coordinateForm).toBeTruthy();
		expect((component.coordinateForm.get("points") as FormArray).length).toBe(
			1,
		);
	});

	it("should add a point", () => {
		component.addPoint();
		fixture.detectChanges();
		expect((component.coordinateForm.get("points") as FormArray).length).toBe(
			2,
		);
	});

	it("should remove a point", () => {
		component.addPoint();
		fixture.detectChanges();
		component.removePoint(1);
		fixture.detectChanges();
		expect((component.coordinateForm.get("points") as FormArray).length).toBe(
			1,
		);
	});

	it("should change projection on onSelectedReferenceChange", () => {
		const spatialReference: SpatialReference = {
			id: 1,
			name: "EPSG:4326",
			type: ProjectionType.Degree,
			definition: "",
		};
		component.onSelectedReferenceChange(spatialReference);
		expect((component as any).newProjection).toBe(spatialReference);
	});

	it("should transform coordinates for Metric projection", () => {
		const point = { x: "100", y: "200" };
		(component as any).newProjection = {
			name: "EPSG:3857",
			type: ProjectionType.Metric,
		} as SpatialReference;
		const transformed = component["transformCoordinates"](point);
		expect(transformed).toEqual(jasmine.any(Array));
	});

	it("should transform coordinates for Degree projection", () => {
		const point = { x: "40", y: "70" };
		(component as any).newProjection = {
			name: "EPSG:4326",
			type: ProjectionType.Degree,
		} as SpatialReference;
		const transformed = component["transformCoordinates"](point);
		expect(transformed).toEqual(jasmine.any(Array));
	});

	it("should create and add a point feature to the map", async () => {
		const point = { x: "40", y: "70" };
		(component as any).newProjection = {
			name: "EPSG:4326",
			type: ProjectionType.Degree,
		} as SpatialReference;
		(component.coordinateForm.get("points") as FormArray).controls[0].setValue(
			point,
		);
		await component.addPointToMap();
		expect(mapServiceStub.addFeatureToMap).toHaveBeenCalled();
	});

	it("should create and add a line feature to the map", async () => {
		const points = [
			{ x: "40", y: "70" },
			{ x: "41", y: "71" },
		];
		(component as any).newProjection = {
			name: "EPSG:4326",
			type: ProjectionType.Degree,
		} as SpatialReference;
		(component.coordinateForm.get("points") as FormArray).clear();
		component.addPoint();
		component.addPoint();
		(component.coordinateForm.get("points") as FormArray).controls[0].setValue(
			points[0],
		);
		(component.coordinateForm.get("points") as FormArray).controls[1].setValue(
			points[1],
		);
		await component.addLineToMap();
		expect(mapServiceStub.addFeatureToMap).toHaveBeenCalled();
	});

	it("should create and add a polygon feature to the map", async () => {
		const points = [
			{ x: "40", y: "70" },
			{ x: "41", y: "71" },
			{ x: "42", y: "72" },
			{ x: "40", y: "70" },
		];
		(component as any).newProjection = {
			name: "EPSG:4326",
			type: ProjectionType.Degree,
		} as SpatialReference;
		(component.coordinateForm.get("points") as FormArray).clear();
		component.addPoint();
		component.addPoint();
		component.addPoint();
		component.addPoint();
		(component.coordinateForm.get("points") as FormArray).controls[0].setValue(
			points[0],
		);
		(component.coordinateForm.get("points") as FormArray).controls[1].setValue(
			points[1],
		);
		(component.coordinateForm.get("points") as FormArray).controls[2].setValue(
			points[2],
		);
		(component.coordinateForm.get("points") as FormArray).controls[3].setValue(
			points[3],
		);
		await component.addPolygonToMap();
		expect(mapServiceStub.addFeatureToMap).toHaveBeenCalled();
	});

	it("should show notification if not enough points for line", async () => {
		const points = { x: "40", y: "70" };
		(component.coordinateForm.get("points") as FormArray).controls[0].setValue(
			points,
		);
		await component.addLineToMap();
		fixture.detectChanges();
		expect(
			fixture.nativeElement.querySelector("app-notification").textContent,
		).toContain("Недостаточно точек для создания фигуры✖");
	});

	it("should show notification if not enough points for polygon", async () => {
		const points = { x: "40", y: "70" };
		(component.coordinateForm.get("points") as FormArray).controls[0].setValue(
			points,
		);
		await component.addPolygonToMap();
		fixture.detectChanges();
		expect(
			fixture.nativeElement.querySelector("app-notification").textContent,
		).toContain("Недостаточно точек для создания фигуры✖");
	});

	it("should remove all coordinates and reset form", () => {
		component.addPoint();
		fixture.detectChanges();
		component.removeAllCoordinates();
		fixture.detectChanges();
		expect((component.coordinateForm.get("points") as FormArray).length).toBe(
			1,
		);
	});

	it("should change projection on onChange", () => {
		const event = { target: { value: "1" } } as any;
		const spatialReference: SpatialReference = {
			id: 1,
			name: "EPSG:4326",
			type: ProjectionType.Degree,
			definition: "",
		};
		component.spatialReferences = [spatialReference];
		component.onChange(event);
		expect((component as any).newProjection).toBe(spatialReference);
	});
});
