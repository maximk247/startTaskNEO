import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CircleComponent } from "./circle.component";
import { DrawService } from "../../../draw/draw.service";
import { MeasurementService } from "../../measurement.service";
import { Map, View } from "ol";
import VectorSource from "ol/source/Vector";
import { LineString, Circle } from "ol/geom";
import { SidenavTools } from "../../../../enums/sidenav.enums";
import { Feature } from "ol";
import { MeasurementMode } from "../../enums/measurement.enum";
import BaseEvent from "ol/events/Event";
import { Interaction } from "ol/interaction";
import { FormsModule } from "@angular/forms";
import { getTranslocoModule } from "src/app/modules/shared/transloco/transloco-testing.module";
import { SharedModule } from "src/app/modules/shared/shared.module";

describe("CircleComponent", () => {
	let component: CircleComponent;
	let fixture: ComponentFixture<CircleComponent>;
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
			"formatMeasurement",
			"setLastId",
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

		TestBed.configureTestingModule({
			declarations: [CircleComponent],
			providers: [
				{ provide: DrawService, useValue: mockDrawService },
				{ provide: MeasurementService, useValue: mockMeasurementService },
			],
			imports: [FormsModule, SharedModule, getTranslocoModule()],
		});
		fixture = TestBed.createComponent(CircleComponent);
		component = fixture.componentInstance;

		mockMap = new Map({ view: new View({ center: [0, 0], zoom: 2 }) });
		mockVectorSource = new VectorSource();

		component.map = mockMap;
		component.vectorSource = mockVectorSource;
		component.currentRadius = 10;
		component.totalRadius = 20;

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should return correct formatted radius", () => {
		expect(component.formatRadius(component.currentRadius)).toBe("10");
	});

	it("should format radius correctly for kilometers", () => {
		component.selectedUnit = "kilometers";
		expect(component.formatRadius(10000)).toBe("10");
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

	it("should add circle interaction on init", () => {
		spyOn(mockMap, "addLayer");
		component.ngOnInit();
		expect(mockMap.addLayer).toHaveBeenCalled();
		expect(mockDrawService.addGlobalInteraction).toHaveBeenCalled();
	});

	it("should emit circleChange event on drawend", () => {
		const mockFeature = new Feature(new Circle([0, 0], 10));
		spyOn(component.circleChange, "emit");

		component.addCircleInteraction();
		component.draw.dispatchEvent({
			type: "drawend",
			feature: mockFeature,
		} as BaseEvent & { feature: Feature<Circle> });

		expect(component.circleChange.emit).toHaveBeenCalled();
	});

	it("should remove existing interactions on init", () => {
		const mockInteraction = jasmine.createSpyObj<Interaction>("Interaction", [
			"on",
			"once",
			"un",
			"handleEvent",
		]);
		mockInteraction.get = jasmine
			.createSpy()
			.and.returnValue(SidenavTools.Measurement);
		spyOn(mockMap.getInteractions(), "getArray").and.returnValue([
			mockInteraction,
		]);

		component.ngOnInit();

		expect(mockDrawService.removeGlobalInteraction).toHaveBeenCalledWith(
			mockMap,
			mockInteraction,
		);
	});

	it("should handle change event on geometry correctly", () => {
		const geometry = new Circle([0, 0], 10);
		spyOn(geometry, "on").and.callThrough();

		component.addCircleInteraction();
		component.draw.dispatchEvent({
			type: "drawstart",
			feature: new Feature({ geometry }),
		} as BaseEvent & { feature: Feature<Circle> });

		expect(geometry.on).toHaveBeenCalledWith(
			jasmine.stringMatching(/change/),
			jasmine.any(Function),
		);
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
