import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CoordinatesComponent } from "./coordinates.component";
import { MapService } from "../../../map/map.service";
import { DrawService } from "../draw/draw.service";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChangeDetectorRef } from "@angular/core";
import { of } from "rxjs";
import Map from "ol/Map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { SpatialReference } from "../../../shared/interfaces/spatial-reference.interfaces";
import { ProjectionType } from "../draw/draw-modules/draw-options/enum/draw-options.enum";
import { CoordinateSystemComponent } from "src/app/modules/shared/shared-components/coordinate-system-selector/coordinate-system.component";
import { HttpClientModule } from "@angular/common/http";
import { getTranslocoModule } from "src/app/modules/shared/transloco/transloco-testing.module";

describe("CoordinatesComponent", () => {
	let component: CoordinatesComponent;
	let fixture: ComponentFixture<CoordinatesComponent>;
	let mapServiceStub: Partial<MapService>;
	let drawServiceStub: Partial<DrawService>;

	beforeEach(async () => {
		mapServiceStub = {
			getMap: jasmine.createSpy("getMap").and.returnValue(new Map({})),
			addCursorToMap: jasmine.createSpy("addCursorToMap"),
			removeAllFeatures: jasmine.createSpy("removeAllFeatures"),
		};

		drawServiceStub = {
			removeGlobalInteraction: jasmine.createSpy("removeGlobalInteraction"),
		};

		await TestBed.configureTestingModule({
			declarations: [CoordinatesComponent, CoordinateSystemComponent],
			providers: [
				{ provide: MapService, useValue: mapServiceStub },
				{ provide: DrawService, useValue: drawServiceStub },
				FormBuilder,
				ChangeDetectorRef,
			],
			imports: [
				getTranslocoModule(),
				FormsModule,
				HttpClientModule,
				ReactiveFormsModule,
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CoordinatesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize map and form on ngOnInit", () => {
		component.ngOnInit();
		expect((component as any).map).toBeTruthy();
		expect((component as any).pointLayer).toBeTruthy();
		expect(component.coordinatesForm).toBeTruthy();
	});

	it("should change projection on selected reference change", () => {
		const spatialReference: SpatialReference = {
			name: "EPSG:4326",
			type: ProjectionType.Degree,
			id: 0,
			definition: "",
		};
		component.onSelectedReferenceChange(spatialReference);
		expect(component.newProjection).toBe(spatialReference);
	});

	it("should set validators for metric projections", () => {
		component.newProjection = {
			name: "EPSG:3857",
			type: ProjectionType.Metric,
		} as SpatialReference;
		(component as any).setValidators();
		expect(component.coordinatesForm.controls["x"].validator).toBeTruthy();
		expect(component.coordinatesForm.controls["y"].validator).toBeTruthy();
		expect(
			component.coordinatesForm.controls["latitudeDegrees"].validator,
		).toBeNull();
		expect(
			component.coordinatesForm.controls["longitudeDegrees"].validator,
		).toBeNull();
	});

	it("should set validators for degree projections", () => {
		component.newProjection = {
			name: "EPSG:4326",
			type: ProjectionType.Degree,
		} as SpatialReference;
		(component as any).setValidators();
		expect(
			component.coordinatesForm.controls["latitudeDegrees"].validator,
		).toBeTruthy();
		expect(
			component.coordinatesForm.controls["longitudeDegrees"].validator,
		).toBeTruthy();
		expect(component.coordinatesForm.controls["x"].validator).toBeNull();
		expect(component.coordinatesForm.controls["y"].validator).toBeNull();
	});

	it("should reset form fields", () => {
		component.coordinatesForm.setValue({
			x: "100",
			y: "200",
			latitudeDegrees: "40",
			latitudeMinutes: "30",
			latitudeSeconds: "20",
			longitudeDegrees: "70",
			longitudeMinutes: "50",
			longitudeSeconds: "10",
			showPoint: true,
		});
		(component as any).resetFormFields();
		Object.keys(component.coordinatesForm.controls).forEach((key) => {
			expect(component.coordinatesForm.controls[key].value).toBeNull();
		});
	});

	it("should remove all coordinates and reset form fields", () => {
		component.removeAllCoordinates();
		expect(mapServiceStub.removeAllFeatures).toHaveBeenCalledWith(
			"coordinates",
		);
		Object.keys(component.coordinatesForm.controls).forEach((key) => {
			expect(component.coordinatesForm.controls[key].value).toBeNull();
		});
	});
	it("should go to coordinates and add point to map", () => {
		const spyAddPointToMap = spyOn(component, "addPointToMap");
		component.newProjection = {
			name: "EPSG:4326",
			type: ProjectionType.Degree,
		} as SpatialReference;
		component.coordinatesForm.setValue({
			x: null,
			y: null,
			latitudeDegrees: "40",
			latitudeMinutes: "30",
			latitudeSeconds: "20",
			longitudeDegrees: "70",
			longitudeMinutes: "50",
			longitudeSeconds: "10",
			showPoint: true,
		});
		component.goToCoordinates();
		expect(spyAddPointToMap).toHaveBeenCalled();
	});

	it("should add point to map", () => {
		const coordinates = [100, 200];
		const source = (component as any).pointLayer.getSource() as VectorSource;
		spyOn(source, "addFeature");
		component.addPointToMap(coordinates);
		expect(source.addFeature).toHaveBeenCalled();
	});

	it("should change projection on onChange", () => {
		const event = { target: { value: "EPSG:4326" } } as any;
		const spatialReference: SpatialReference = {
			name: "EPSG:4326",
			type: ProjectionType.Degree,
			id: 0,
			definition: "",
		};
		component.spatialReferences = [spatialReference];
		component.onChange(event);
		expect(component.newProjection).toBe(spatialReference);
	});

	it("should return true if any field is filled (metric)", () => {
		component.newProjection = {
			name: "EPSG:3857",
			type: ProjectionType.Metric,
		} as SpatialReference;
		component.coordinatesForm.setValue({
			x: "100",
			y: null,
			latitudeDegrees: null,
			latitudeMinutes: null,
			latitudeSeconds: null,
			longitudeDegrees: null,
			longitudeMinutes: null,
			longitudeSeconds: null,
			showPoint: false,
		});
		expect(component.isAnyFieldFilled).toBeTrue();
	});

	it("should return true if any field is filled (degree)", () => {
		component.newProjection = {
			name: "EPSG:4326",
			type: ProjectionType.Degree,
		} as SpatialReference;
		component.coordinatesForm.setValue({
			x: null,
			y: null,
			latitudeDegrees: "40",
			latitudeMinutes: null,
			latitudeSeconds: null,
			longitudeDegrees: null,
			longitudeMinutes: null,
			longitudeSeconds: null,
			showPoint: false,
		});
		expect(component.isAnyFieldFilled).toBeTrue();
	});

	it("should return false if no field is filled", () => {
		component.newProjection = {
			name: "EPSG:4326",
			type: ProjectionType.Degree,
		} as SpatialReference;
		component.coordinatesForm.setValue({
			x: null,
			y: null,
			latitudeDegrees: null,
			latitudeMinutes: null,
			latitudeSeconds: null,
			longitudeDegrees: null,
			longitudeMinutes: null,
			longitudeSeconds: null,
			showPoint: false,
		});
		expect(component.isAnyFieldFilled).toBeFalse();
	});
});
