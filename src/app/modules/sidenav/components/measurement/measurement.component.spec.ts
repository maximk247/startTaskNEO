import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MeasurementComponent } from "./measurement.component";
import { MapService } from "../../../map/map.service";
import { DrawService } from "../draw/draw.service";
import { MeasurementService } from "./measurement.service";
import { Map, View } from "ol";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { MeasurementMode } from "./enums/measurement.enum";
import {
	MeasurementType,
	MeasurementPoint,
	MeasurementLine,
	MeasurementPolygon,
	MeasurementCircle,
} from "./interfaces/measurement.interface";
import { PointComponent } from "./geometry/point/point.component";
import { LineComponent } from "./geometry/line/line.component";
import { CircleComponent } from "./geometry/circle/circle.component";
import { PolygonComponent } from "./geometry/polygon/polygon.component";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import Polygon from "ol/geom/Polygon";
import Circle from "ol/geom/Circle";
import { SidenavTools } from "../../enums/sidenav.enums";
import { getTranslocoModule } from "src/app/modules/shared/transloco/transloco-testing.module";
import { ExplanationComponent } from "src/app/modules/shared/shared-components/explanation/explanation.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { CoordinateSystemComponent } from "src/app/modules/shared/shared-components/coordinate-system-selector/coordinate-system.component";

describe("MeasurementComponent", () => {
	let component: MeasurementComponent;
	let fixture: ComponentFixture<MeasurementComponent>;
	let mockMapService: any;
	let mockDrawService: any;
	let mockMeasurementService: any;

	beforeEach(() => {
		mockMapService = jasmine.createSpyObj([
			"getMap",
			"addCursorToMap",
			"removeAllFeatures",
		]);
		mockDrawService = jasmine.createSpyObj(["removeGlobalInteraction"]);
		mockMeasurementService = jasmine.createSpyObj([
			"getMeasurements",
			"setMeasurements",
			"getLastId",
			"clearMeasurements",
			"setStyle",
		]);

		TestBed.configureTestingModule({
			declarations: [
				MeasurementComponent,
				PointComponent,
				LineComponent,
				CircleComponent,
				PolygonComponent,
				ExplanationComponent,
				CoordinateSystemComponent,
			],
			providers: [
				{ provide: MapService, useValue: mockMapService },
				{ provide: DrawService, useValue: mockDrawService },
				{ provide: MeasurementService, useValue: mockMeasurementService },
			],
			imports: [getTranslocoModule(), FormsModule, HttpClientModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MeasurementComponent);
		component = fixture.componentInstance;
		component.map = new Map({
			layers: [new VectorLayer({ source: new VectorSource() })],
			view: new View({ center: [0, 0], zoom: 2 }),
		});
		mockMapService.getMap.and.returnValue(component.map);
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should set text based on mode", () => {
		(component as any).setTextBasedOnMode(MeasurementMode.Point);
		expect(component.text).toBe("Укажите точку на карте.");

		(component as any).setTextBasedOnMode(MeasurementMode.Line);
		expect(component.text).toBe(
			"Укажите узлы измеряемой линии на карте. Завершите измерение, дважды щелкнув по карте левой кнопкой мыши.",
		);

		(component as any).setTextBasedOnMode(MeasurementMode.Circle);
		expect(component.text).toBe(
			"Укажите точку на карте. Завершите измерение, дважды щелкнув по карте левой кнопкой мыши.",
		);

		(component as any).setTextBasedOnMode(MeasurementMode.Polygon);
		expect(component.text).toBe(
			"Укажите узлы измеряемой фигуры на карте. Завершите измерение, дважды щелкнув по карте левой кнопкой мыши.",
		);
	});

	it("should change mode and update text", () => {
		const event = {
			target: { value: MeasurementMode.Line },
		} as unknown as Event;
		component.onModeChange(event);

		expect(component.text).toBe(
			"Укажите узлы измеряемой линии на карте. Завершите измерение, дважды щелкнув по карте левой кнопкой мыши.",
		);
	});

	it("should add point measurement", () => {
		const point: MeasurementPoint = {
			id: 1,
			type: MeasurementMode.Point,
			feature: new Feature(new Point([0, 0])),
			coordinates: [0, 0],
		};
		component.onPointChange(point);

		expect(component.allMeasurements.length).toBe(1);
		expect(mockMeasurementService.setMeasurements).toHaveBeenCalledWith(
			component.allMeasurements,
		);
	});

	it("should add line measurement", () => {
		const line: MeasurementLine = {
			id: 1,
			type: MeasurementMode.Line,
			feature: new Feature(
				new LineString([
					[0, 0],
					[1, 1],
				]),
			),
			length: "100",
		};
		component.onLineChange(line);

		expect(component.allMeasurements.length).toBe(1);
		expect(mockMeasurementService.setMeasurements).toHaveBeenCalledWith(
			component.allMeasurements,
		);
	});

	it("should add polygon measurement", () => {
		const polygon: MeasurementPolygon = {
			id: 1,
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
			area: "100",
			perimeter: "40",
		};
		component.onPolygonChange(polygon);

		expect(component.allMeasurements.length).toBe(1);
		expect(mockMeasurementService.setMeasurements).toHaveBeenCalledWith(
			component.allMeasurements,
		);
	});

	it("should add circle measurement", () => {
		const circle: MeasurementCircle = {
			id: 1,
			type: MeasurementMode.Circle,
			feature: new Feature(new Circle([0, 0], 100)),
			radius: "100",
		};
		component.onCircleChange(circle);

		expect(component.allMeasurements.length).toBe(1);
		expect(mockMeasurementService.setMeasurements).toHaveBeenCalledWith(
			component.allMeasurements,
		);
	});

	it("should remove measurement", () => {
		const measurement: MeasurementPoint = {
			id: 1,
			type: MeasurementMode.Point,
			feature: new Feature(new Point([0, 0])),
			coordinates: [0, 0],
		};
		component.vectorSource = new VectorSource();
		component.allMeasurements.push(measurement);
		component.removeMeasurement(measurement);

		expect(component.allMeasurements.length).toBe(0);
		expect(mockMeasurementService.setMeasurements).toHaveBeenCalledWith(
			component.allMeasurements,
		);
	});

	it("should remove all measurements", () => {
		const measurement: MeasurementPoint = {
			id: 1,
			type: MeasurementMode.Point,
			feature: new Feature(new Point([0, 0])),
			coordinates: [0, 0],
		};
		component.vectorSource = new VectorSource();
		component.allMeasurements.push(measurement);
		component.removeAllMeasurement();

		expect(component.allMeasurements.length).toBe(0);
		expect(mockMapService.removeAllFeatures).toHaveBeenCalledWith(
			SidenavTools.Measurement,
		);
		expect(mockMeasurementService.clearMeasurements).toHaveBeenCalled();
	});
});
