import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MeasurementComponent } from "./measurement.component";
import { MapService } from "../../map/map.service";
import { DrawService } from "../draw/draw.service";
import { MeasurementService } from "./measurement.service";
import { Map as MapOpen, View, Feature, Overlay } from "ol";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { PointComponent } from "./geometry/point/point.component";
import { LineComponent } from "./geometry/line/line.component";
import { CircleComponent } from "./geometry/circle/circle.component";
import { PolygonComponent } from "./geometry/polygon/polygon.component";
import { MeasurementMode } from "./enums/measurement.enum";
import { SidenavTools } from "../enums/sidenav.enums";
import {
	MeasurementPoint,
	MeasurementLine,
	MeasurementPolygon,
	MeasurementCircle,
	MeasurementType,
} from "./interfaces/measurement.interface";
import { FormsModule } from "@angular/forms";
import { getTranslocoModule } from "src/app/modules/shared/transloco/transloco-testing.module";
import { SharedModule } from "src/app/modules/shared/shared.module";
import { Point, LineString, Polygon, Circle } from "ol/geom";
import { HttpClientModule } from "@angular/common/http";

describe("MeasurementComponent", () => {
	let component: MeasurementComponent;
	let fixture: ComponentFixture<MeasurementComponent>;
	let mockMapService: MapService;
	let mockDrawService: DrawService;
	let mockMeasurementService: MeasurementService;
	let mockMap: MapOpen;
	let mockVectorSource: VectorSource;

	beforeEach(() => {
		mockMapService = jasmine.createSpyObj("MapService", [
			"getMap",
			"removeAllFeatures",
		]);
		mockDrawService = jasmine.createSpyObj("DrawService", [
			"addGlobalInteraction",
			"removeGlobalInteraction",
		]);
		mockMeasurementService = jasmine.createSpyObj("MeasurementService", [
			"getMeasurements",
			"setMeasurements",
			"clearMeasurements",
			"getLastId",
			"getLastIdMeasurement",
		]);

		(mockMapService.getMap as jasmine.Spy).and.returnValue(
			new MapOpen({ view: new View({ center: [0, 0], zoom: 2 }) }),
		);
		(mockMeasurementService.getMeasurements as jasmine.Spy).and.returnValue([]);

		TestBed.configureTestingModule({
			declarations: [
				MeasurementComponent,
				PointComponent,
				LineComponent,
				CircleComponent,
				PolygonComponent,
			],
			providers: [
				{ provide: MapService, useValue: mockMapService },
				{ provide: DrawService, useValue: mockDrawService },
				{ provide: MeasurementService, useValue: mockMeasurementService },
			],
			imports: [
				FormsModule,
				SharedModule,
				getTranslocoModule(),
				HttpClientModule,
			],
		});

		fixture = TestBed.createComponent(MeasurementComponent);
		component = fixture.componentInstance;

		mockMap = mockMapService.getMap();
		mockVectorSource = new VectorSource();

		component.map = mockMap;
		component.vectorSource = mockVectorSource;

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize the map and vector source on ngOnInit", () => {
		spyOn(mockMap, "addLayer");
		component.ngOnInit();
		expect(component.vectorSource).toBeDefined();
		expect(mockMap.addLayer).toHaveBeenCalledWith(jasmine.any(VectorLayer));
	});

	it("should load saved measurements on ngOnInit", () => {
		(mockMeasurementService.getMeasurements as jasmine.Spy).and.returnValue([
			{
				id: 1,
				type: MeasurementMode.Point,
				feature: new Feature(),
				measureTooltips: new Map<number, Overlay>(),
			},
		]);
		component.ngOnInit();
		expect(component.allMeasurements.length).toBe(1);
	});

	it("should remove existing interactions on ngOnInit", () => {
		const mockInteraction = jasmine.createSpyObj("Interaction", [
			"get",
			"on",
			"once",
			"un",
			"handleEvent",
		]);
		mockInteraction.get.and.returnValue(SidenavTools.Measurement);
		spyOn(mockMap.getInteractions(), "getArray").and.returnValue([
			mockInteraction,
		]);

		component.ngOnInit();
		expect(mockDrawService.removeGlobalInteraction).toHaveBeenCalledWith(
			mockMap,
			mockInteraction,
		);
	});

	it("should handle point change correctly", () => {
		const point: MeasurementPoint = {
			id: 1,
			type: MeasurementMode.Point,
			feature: new Feature(),
			coordinates: [0, 0],
		};
		spyOn<any>(component, "saveMeasurements");
		component.onPointChange(point);
		expect(component.allMeasurements).toContain(point);
		expect((component as any).saveMeasurements).toHaveBeenCalled();
	});

	it("should handle line change correctly", () => {
		const line: MeasurementLine = {
			id: 1,
			type: MeasurementMode.Line,
			feature: new Feature(),
			length: "0.00",
		};
		spyOn<any>(component, "saveMeasurements");
		component.onLineChange(line);
		expect(component.allMeasurements).toContain(line);
		expect((component as any).saveMeasurements).toHaveBeenCalled();
	});

	it("should handle polygon change correctly", () => {
		const polygon: MeasurementPolygon = {
			id: 1,
			type: MeasurementMode.Polygon,
			feature: new Feature(),
			area: "0.00",
			perimeter: "0.00",
		};
		spyOn<any>(component, "saveMeasurements");
		component.onPolygonChange(polygon);
		expect(component.allMeasurements).toContain(polygon);
		expect((component as any).saveMeasurements).toHaveBeenCalled();
	});

	it("should handle circle change correctly", () => {
		const circle: MeasurementCircle = {
			id: 1,
			type: MeasurementMode.Circle,
			feature: new Feature(),
			radius: "0.00",
		};
		spyOn<any>(component, "saveMeasurements");
		component.onCircleChange(circle);
		expect(component.allMeasurements).toContain(circle);
		expect((component as any).saveMeasurements).toHaveBeenCalled();
	});

	it("should remove a specific measurement", () => {
		const point: MeasurementPoint = {
			id: 1,
			type: MeasurementMode.Point,
			feature: new Feature(),
			measureTooltips: new Map<number, Overlay>(),
			coordinates: [0, 0],
		};
		component.allMeasurements = [point];
		spyOn<any>(component, "checkAndResetMeasurement");

		component.removeMeasurement(point);

		expect(component.allMeasurements).not.toContain(point);
		expect((component as any).checkAndResetMeasurement).toHaveBeenCalledWith(
			"point",
			component.pointComponent,
			"resetPoint",
		);
	});

	it("should remove all measurements", () => {
		const point: MeasurementPoint = {
			id: 1,
			type: MeasurementMode.Point,
			feature: new Feature(),
			coordinates: [0, 0],
		};
		const line: MeasurementLine = {
			id: 2,
			type: MeasurementMode.Line,
			feature: new Feature(),
			length: "0.00",
		};
		component.allMeasurements = [point, line];
		spyOn(component, "removeMeasurement").and.callThrough();

		component.removeAllMeasurement();
		expect(component.allMeasurements.length).toBe(0);
		expect(component.removeMeasurement).toHaveBeenCalledTimes(2);
		expect(mockMapService.removeAllFeatures).toHaveBeenCalledWith(
			SidenavTools.Measurement,
		);
		expect(mockMeasurementService.clearMeasurements).toHaveBeenCalled();
	});

	it("should save measurements", () => {
		component.allMeasurements = [
			{
				id: 1,
				type: MeasurementMode.Point,
				feature: new Feature(new Point([0, 0])),
				coordinates: [0, 0],
			},
			{
				id: 2,
				type: MeasurementMode.Line,
				feature: new Feature(
					new LineString([
						[0, 0],
						[1, 1],
					]),
				),
				length: "0.00",
			},
			{
				id: 3,
				type: MeasurementMode.Polygon,
				feature: new Feature(
					new Polygon([
						[
							[0, 0],
							[1, 1],
							[1, 0],
							[0, 0],
						],
					]),
				),
				area: "0.00",
				perimeter: "0.00",
			},
			{
				id: 4,
				type: MeasurementMode.Circle,
				feature: new Feature(new Circle([0, 0], 1)),
				radius: "0.00",
			},
		];
		(component as any).saveMeasurements();
		expect(mockMeasurementService.setMeasurements).toHaveBeenCalledWith(
			component.allMeasurements,
		);
	});

	it("should load measurements", () => {
		const point: MeasurementPoint = {
			id: 1,
			type: MeasurementMode.Point,
			feature: new Feature(new Point([0, 0])),
			measureTooltips: new Map<number, Overlay>([[1, new Overlay({})]]),
			coordinates: [0, 0],
		};
		component.allMeasurements = [point];

		const spyAddOverlay = spyOn(mockMap, "addOverlay").and.callThrough();
		const spyAddFeature = spyOn(
			component.vectorSource,
			"addFeature",
		).and.callThrough();

		(component as any).loadMeasurements();

		expect(spyAddOverlay).toHaveBeenCalledWith(point.measureTooltips!.get(1)!);

		expect(spyAddFeature).toHaveBeenCalledWith(point.feature!);
		expect(component.allMeasurements).toContain(point);
	});
	it("should reset measurement component if no measurements of a type remain", () => {
		const point: MeasurementPoint = {
			id: 1,
			type: MeasurementMode.Point,
			feature: new Feature(),
			coordinates: [0, 0],
		};
		component.allMeasurements = [point];
		component.pointComponent = jasmine.createSpyObj("PointComponent", [
			"resetPoint",
		]);

		component.removeMeasurement(point);
		expect(component.pointComponent.resetPoint).toHaveBeenCalled();
	});

	it("should correctly identify measurement types", () => {
		const point: MeasurementType = {
			id: 1,
			type: MeasurementMode.Point,
			feature: new Feature<Point>(new Point([0, 0])),
			coordinates: [0, 0],
		};
		const line: MeasurementType = {
			id: 2,
			type: MeasurementMode.Line,
			feature: new Feature<LineString>(
				new LineString([
					[0, 0],
					[1, 1],
				]),
			),
			length: "0.00",
		};
		const polygon: MeasurementType = {
			id: 3,
			type: MeasurementMode.Polygon,
			feature: new Feature<Polygon>(
				new Polygon([
					[
						[0, 0],
						[1, 1],
						[1, 0],
						[0, 0],
					],
				]),
			),
			area: "0.00",
			perimeter: "0.00",
		};
		const circle: MeasurementType = {
			id: 4,
			type: MeasurementMode.Circle,
			feature: new Feature<Circle>(new Circle([0, 0], 1)),
			radius: "0.00",
		};

		expect(component.isPoint(point)).toBeTrue();
		expect(component.isLine(line)).toBeTrue();
		expect(component.isPolygon(polygon)).toBeTrue();
		expect(component.isCircle(circle)).toBeTrue();

		expect(component.isPoint(line)).toBeFalse();
		expect(component.isLine(polygon)).toBeFalse();
		expect(component.isPolygon(circle)).toBeFalse();
		expect(component.isCircle(point)).toBeFalse();
	});
});
