import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MapService } from "../../map/map.service";
import { DrawService } from "../draw/draw.service";
import { MeasurementComponent } from "./measurement.component";
import { FormsModule } from "@angular/forms";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Circle, LineString, Point, Polygon } from "ol/geom";
import { Feature } from "ol";

describe("MeasurementComponent", () => {
	let component: MeasurementComponent;
	let fixture: ComponentFixture<MeasurementComponent>;

	const mapServiceMock: Partial<MapService> = {
		getMap: jasmine.createSpy("getMap").and.returnValue({
			addLayer: jasmine.createSpy("addLayer"),
			getInteractions: jasmine.createSpy("getInteractions").and.returnValue({
				getArray: jasmine.createSpy("getArray").and.returnValue([]),
			}),
			addOverlay: jasmine.createSpy("addOverlay"),
			removeOverlay: jasmine.createSpy("removeOverlay"),
			getView: jasmine.createSpy("getView").and.returnValue({
				getProjection: jasmine.createSpy("getProjection").and.returnValue({
					getCode: jasmine.createSpy("getCode").and.returnValue("EPSG:3857"),
				}),
			}),
		}),
		initMap: jasmine.createSpy("initMap"),
		addFeatureToMap: jasmine.createSpy("addFeatureToMap"),
		getCurrentProjection: jasmine
			.createSpy("getCurrentProjection")
			.and.returnValue("EPSG:3857"),
	};

	const drawServiceMock: Partial<DrawService> = {
		addGlobalInteraction: jasmine.createSpy("addGlobalInteraction"),
		removeGlobalInteraction: jasmine.createSpy("removeGlobalInteraction"),
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MeasurementComponent],
			imports: [FormsModule],
			providers: [
				{ provide: MapService, useValue: mapServiceMock },
				{ provide: DrawService, useValue: drawServiceMock },
			],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();

		fixture = TestBed.createComponent(MeasurementComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should change mode and add corresponding interaction", () => {
		spyOn(component, "addPointInteraction").and.callThrough();
		spyOn(component, "addLineInteraction").and.callThrough();
		spyOn(component, "addPolygonInteraction").and.callThrough();
		spyOn(component, "addCircleInteraction").and.callThrough();

		component.changeMode("point");
		expect(drawServiceMock.removeGlobalInteraction).toHaveBeenCalled();
		expect(component.addPointInteraction).toHaveBeenCalled();

		component.changeMode("line");
		expect(drawServiceMock.removeGlobalInteraction).toHaveBeenCalled();
		expect(component.addLineInteraction).toHaveBeenCalled();

		component.changeMode("polygon");
		expect(drawServiceMock.removeGlobalInteraction).toHaveBeenCalled();
		expect(component.addPolygonInteraction).toHaveBeenCalled();

		component.changeMode("circle");
		expect(drawServiceMock.removeGlobalInteraction).toHaveBeenCalled();
		expect(component.addCircleInteraction).toHaveBeenCalled();
	});

	it("should calculate length", () => {
		const geometry = new LineString([
			[156, 1],
			[165, 2],
		]);
		const length = (component as any).calculateLength(geometry);
		expect(length).toBe("1006560.09m");
	});

	it("should calculate radius", () => {
		const geometry = new Circle([0, 0], 10);
		const radius = (component as any).calculateRadius(geometry);
		expect(radius).toBe("1111950.8m");
	});

	it("should calculate area", () => {
		const geometry = new Polygon([
			[
				[0, 0],
				[0, 10],
				[10, 10],
				[10, 0],
				[0, 0],
			],
		]);
		const area = (component as any).calculateArea(geometry);
		expect(area).toBe("1230166.82 km²");
	});

	it("should calculate perimeter", () => {
		const geometry = new Polygon([
			[
				[0, 0],
				[0, 10],
				[10, 10],
				[10, 0],
				[0, 0],
			],
		]);
		const perimeter = (component as any).calculatePerimeter(geometry);
		expect(perimeter).toBe(4430868.14);
	});

	it("should remove point", () => {
		const point = { id: 1, feature: new Feature<Point>(new Point([0, 0])) };
		component.points.push(point);
		component.createPointTooltip(1, { setPosition: () => null } as any);

		component.removePoint(1);
		expect(component.points.length).toBe(0);
	});

	it("should remove line", () => {
		const line = {
			id: 1,
			feature: new Feature<LineString>(
				new LineString([
					[0, 0],
					[10, 10],
				]),
			),
			length: "100",
		};
		component.lines.push(line);

		component.removeLine(1);
		expect(component.lines.length).toBe(0);
	});

	it("should remove polygon", () => {
		const polygon = {
			id: 1,
			feature: new Feature<Polygon>(
				new Polygon([
					[
						[0, 0],
						[0, 10],
						[10, 10],
						[10, 0],
						[0, 0],
					],
				]),
			),
			area: 100, // Changed to number
			perimeter: 100, // Changed to number
		};
		component.polygons.push(polygon as any);

		component.removePolygon(1);
		expect(component.polygons.length).toBe(0);
	});

	it("should remove circle", () => {
		const circle = {
			id: 1,
			feature: new Feature<Circle>(new Circle([0, 0], 10)),
			radius: "100",
		};
		component.circles.push(circle);

		component.removeCircle(1);
		expect(component.circles.length).toBe(0);
	});

	it("should add feature to map", () => {
		const feature = new Feature();
		expect(mapServiceMock.addFeatureToMap).toHaveBeenCalledWith(
			feature,
			"EPSG:4326",
			"EPSG:3857",
		);
	});
});
