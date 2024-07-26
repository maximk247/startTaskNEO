import {
	ComponentFixture,
	ComponentFixtureAutoDetect,
	TestBed,
} from "@angular/core/testing";
import { CircleComponent } from "./circle.component";
import { DrawService } from "../../../draw/draw.service";
import { MeasurementService } from "../../measurement.service";
import { Collection, Map, View } from "ol";
import VectorSource from "ol/source/Vector";
import { LineString, Circle } from "ol/geom";
import { SidenavTools } from "../../../../enums/sidenav.enums";
import { Feature } from "ol";
import { MeasurementMode } from "../../enums/measurement.enum";
import BaseEvent from "ol/events/Event";
import { Draw, Interaction } from "ol/interaction";
import { FormsModule } from "@angular/forms";
import { getTranslocoModule } from "src/app/modules/shared/transloco/transloco-testing.module";
import { SharedModule } from "src/app/modules/shared/shared.module";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CustomDraw } from "src/app/modules/shared/classes/draw-interaction.class";
import VectorLayer from "ol/layer/Vector";
import { HttpClientModule } from "@angular/common/http";
import { Type } from "ol/geom/Geometry";

describe("CircleComponent", () => {
	let component: CircleComponent;
	let fixture: ComponentFixture<CircleComponent>;
	let mockDrawService: any;
	let mockMeasurementService: any;
	let mockMap: Map;
	let mockVectorSource: VectorSource;
	let mockInteractions: jasmine.SpyObj<Collection<Interaction>>;

	beforeEach(() => {
		mockDrawService = {
			removeGlobalInteraction: jasmine
				.createSpy("removeGlobalInteraction")
				.and.callThrough(),
			addGlobalInteraction: jasmine
				.createSpy("addGlobalInteraction")
				.and.callThrough(),
		};

		mockMeasurementService = jasmine.createSpyObj([
			"getLastIdMeasurement",
			"setStyle",
			"formatMeasurement",
			"setLastId",
		]);
		mockMeasurementService.getLastIdMeasurement?.and.returnValue(1);

		mockInteractions = jasmine.createSpyObj("Collection", ["getArray"]);
		mockInteractions.getArray.and.returnValue([]);

		(mockMeasurementService.formatMeasurement as jasmine.Spy).and.callFake(
			(measure: number, unit: string) => {
				if (unit === "kilometers") {
					return `${measure / 1000} km`;
				} else {
					return `${measure} м`;
				}
			},
		);

		TestBed.configureTestingModule({
			declarations: [CircleComponent],
			providers: [
				{ provide: DrawService, useValue: mockDrawService },
				{ provide: MeasurementService, useValue: mockMeasurementService },
				{
					provide: ComponentFixtureAutoDetect,
					useValue: true,
				},
			],
			imports: [
				FormsModule,
				SharedModule,
				getTranslocoModule(),
				HttpClientModule,
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
		fixture = TestBed.createComponent(CircleComponent);
		component = fixture.componentInstance;

		mockMap = new Map({
			layers: [new VectorLayer({ source: new VectorSource() })],
			view: new View({ center: [0, 0], zoom: 2 }),
		});
		mockVectorSource = new VectorSource();

		component.map = mockMap;
		component.vectorSource = mockVectorSource;
		component.currentRadius = 10;
		component.totalRadius = 10;
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should return correct formatted radius", () => {
		expect(component.formatRadius(component.currentRadius)).toBe("10.00");
	});

	it("should format radius correctly for kilometers", () => {
		component.selectedUnit = "kilometers";
		expect(component.formatRadius(10000)).toBe("10.00");
	});

	it("should reset radius", () => {
		component.resetCircle();
		expect(component.currentRadius).toBe(0);
		expect(component.totalRadius).toBe(0);
	});

	it("should calculate radius", () => {
		const geometry = new LineString([
			[1, 1],
			[5, 5],
		]);
		expect((component as any).calculateRadius(geometry)).toBeCloseTo(628519, 0);
	});

	it("should get last measurement ID for circle", () => {
		(
			mockMeasurementService.getLastIdMeasurement as jasmine.Spy
		).and.returnValue(5);
		expect(
			component.measurementService.getLastIdMeasurement(MeasurementMode.Circle),
		).toBe(5);
	});

	it("should format measurement correctly for kilometers", () => {
		expect(
			component.measurementService.formatMeasurement(10000, "kilometers"),
		).toBe("10 km");
	});

	it("should format measurement correctly for meters", () => {
		expect(component.measurementService.formatMeasurement(10, "meters")).toBe(
			"10 м",
		);
	});
});
