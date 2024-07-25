import { TestBed } from "@angular/core/testing";
import { MeasurementService } from "./measurement.service";
import {
	MeasurementType,
	MeasurementPoint,
	MeasurementLine,
	MeasurementPolygon,
	MeasurementCircle,
} from "./interfaces/measurement.interface";
import { MeasurementMode } from "./enums/measurement.enum";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import Polygon from "ol/geom/Polygon";
import Circle from "ol/geom/Circle";
import { Style } from "ol/style";

describe("MeasurementService", () => {
	let service: MeasurementService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(MeasurementService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});

	it("should initialize with empty measurements and lastId", () => {
		expect(service.getMeasurements()).toEqual([]);
		expect(service.getLastId()).toEqual({
			point: 0,
			line: 0,
			polygon: 0,
			circle: 0,
		});
	});

	it("should set and get measurements correctly", () => {
		const pointFeature = new Feature(new Point([0, 0]));
		const lineFeature = new Feature(
			new LineString([
				[0, 0],
				[1, 1],
			]),
		);
		const measurements: Array<MeasurementType> = [
			{
				type: "Point",
				id: 1,
				feature: pointFeature,
				coordinates: [0, 0],
			} as MeasurementPoint,
			{
				type: "LineString",
				id: 2,
				feature: lineFeature,
				length: "200m",
			} as MeasurementLine,
		];
		service.setMeasurements(measurements);
		expect(service.getMeasurements()).toEqual(measurements);
	});

	it("should get and set lastId correctly", () => {
		service.setLastId(MeasurementMode.Point, 5);
		expect(service.getLastIdMeasurement(MeasurementMode.Point)).toBe(5);
		service.setLastId(MeasurementMode.Line, 3);
		expect(service.getLastIdMeasurement(MeasurementMode.Line)).toBe(3);
	});

	it("should clear measurements and reset lastId", () => {
		const pointFeature = new Feature(new Point([0, 0]));
		service.setMeasurements([
			{
				type: "Point",
				id: 1,
				feature: pointFeature,
				coordinates: [0, 0],
			} as MeasurementPoint,
		]);
		service.setLastId(MeasurementMode.Point, 5);
		service.clearMeasurements();
		expect(service.getMeasurements()).toEqual([]);
		expect(service.getLastId()).toEqual({
			point: 0,
			line: 0,
			polygon: 0,
			circle: 0,
		});
	});

	it("should format measurements correctly", () => {
		expect(service.formatMeasurement(1500, "meters")).toBe("1500 м");
		expect(service.formatMeasurement(1500, "kilometers")).toBe("1.5 км");
		expect(service.formatMeasurementSquare(1500000, "squareMeters")).toBe(
			"1500000 м²",
		);
		expect(service.formatMeasurementSquare(1500000, "squareKilometers")).toBe(
			"1.5 км²",
		);
	});

	it("should set style of a feature correctly", () => {
		const feature = new Feature();
		service.setStyle(feature, "red", "blue");
		const style = feature.getStyle() as Style;

		expect((style.getStroke() as any).getColor()).toBe("red");
		expect((style.getFill() as any).getColor()).toBe("blue");
	});
});
