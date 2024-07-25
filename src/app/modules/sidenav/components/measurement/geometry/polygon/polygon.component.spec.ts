import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PolygonComponent } from "./polygon.component";
import { DrawService } from "../../../draw/draw.service";
import { MeasurementService } from "../../measurement.service";
import { Map, View, Feature } from "ol";
import VectorSource from "ol/source/Vector";
import { Polygon } from "ol/geom";
import { SidenavTools } from "../../../../enums/sidenav.enums";
import BaseEvent from "ol/events/Event";
import { Interaction } from "ol/interaction";
import { FormsModule } from "@angular/forms";
import { getTranslocoModule } from "src/app/modules/shared/transloco/transloco-testing.module";
import { SharedModule } from "src/app/modules/shared/shared.module";
import VectorLayer from "ol/layer/Vector";
import { of } from "rxjs";
import { MeasurementMode } from "../../enums/measurement.enum";
import { CustomDraw } from "src/app/modules/shared/classes/draw-interaction.class";

describe("PolygonComponent", () => {
	let component: PolygonComponent;
	let fixture: ComponentFixture<PolygonComponent>;
	let mockDrawService: DrawService;
	let mockMeasurementService: MeasurementService;
	let mockMap: Map;
	let mockVectorSource: VectorSource;

	beforeEach(() => {
		mockDrawService = jasmine.createSpyObj("DrawService", [
			"addGlobalInteraction",
			"removeGlobalInteraction",
		]);
		mockMeasurementService = jasmine.createSpyObj("MeasurementService", [
			"getLastIdMeasurement",
			"setLastId",
			"formatMeasurement",
			"formatMeasurementSquare",
		]);

		(mockMeasurementService.formatMeasurement as jasmine.Spy).and.callFake(
			(measure: number, unit: string) => {
				if (unit === "kilometers") {
					return `${measure / 1000} km`;
				} else {
					return `${measure} м`;
				}
			},
		);

		(
			mockMeasurementService.formatMeasurementSquare as jasmine.Spy
		).and.callFake((measure: number, unit: string) => {
			if (unit === "squareKilometers") {
				return `${measure / 1000000} km²`;
			} else {
				return `${measure} м²`;
			}
		});

		TestBed.configureTestingModule({
			declarations: [PolygonComponent],
			providers: [
				{ provide: DrawService, useValue: mockDrawService },
				{ provide: MeasurementService, useValue: mockMeasurementService },
			],
			imports: [FormsModule, SharedModule, getTranslocoModule()],
		});

		fixture = TestBed.createComponent(PolygonComponent);
		component = fixture.componentInstance;

		const mockMapOpen = new Map({
			layers: [new VectorLayer({ source: new VectorSource() })],
			view: new View({ center: [0, 0], zoom: 2 }),
		});
		mockVectorSource = new VectorSource();

		component.map = mockMapOpen;
		component.vectorSource = mockVectorSource;
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should calculate area correctly", () => {
		const geometry = new Polygon([
			[
				[0, 0],
				[10, 10],
				[10, 0],
				[0, 0],
			],
		]);
		const area = component["calculateArea"](geometry);
		expect(area).toBeCloseTo(615083407785, 0);
	});

	it("should calculate perimeter correctly", () => {
		const geometry = new Polygon([
			[
				[0, 0],
				[10, 10],
				[10, 0],
				[0, 0],
			],
		]);
		const perimeter = component["calculatePerimeter"](geometry);
		expect(perimeter).toBeCloseTo(3792424, 0);
	});

	it("should reset polygon correctly", () => {
		spyOn(component.polygonChange, "emit");
		component.polygons = [
			{
				id: 1,
				type: MeasurementMode.Polygon,
				feature: new Feature(),
				area: "100 м²",
				perimeter: "40 м",
			},
		];

		component.resetPolygon();

		expect(component.polygonChange.emit).toHaveBeenCalledWith(null);
		expect(component.polygons.length).toBe(0);
		expect(component.polygonCounter).toBe(0);
		expect(component.totalArea).toBe(0);
		expect(component.totalPerimeter).toBe(0);
	});
});
