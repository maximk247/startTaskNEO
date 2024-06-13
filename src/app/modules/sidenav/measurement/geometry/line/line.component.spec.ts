import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LineComponent } from "./line.component";
import { DrawService } from "../../../draw/draw.service";
import { MeasurementService } from "../../measurement.service";
import { Map, View } from "ol";
import VectorSource from "ol/source/Vector";
import { LineString } from "ol/geom";
import { SidenavTools } from "../../../interfaces/sidenav.interface";
import { Feature } from "ol";
import BaseEvent from "ol/events/Event";
import { Interaction } from "ol/interaction";
import { FormsModule } from "@angular/forms";
import { getTranslocoModule } from "src/app/modules/shared/transloco/transloco-testing.module";
import { SharedModule } from "src/app/modules/shared/shared.module";

describe("LineComponent", () => {
	let component: LineComponent;
	let fixture: ComponentFixture<LineComponent>;
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
			declarations: [LineComponent],
			providers: [
				{ provide: DrawService, useValue: mockDrawService },
				{ provide: MeasurementService, useValue: mockMeasurementService },
			],
			imports: [FormsModule, SharedModule, getTranslocoModule()],
		});
		fixture = TestBed.createComponent(LineComponent);
		component = fixture.componentInstance;

		mockMap = new Map({ view: new View({ center: [0, 0], zoom: 2 }) });
		mockVectorSource = new VectorSource();

		component.map = mockMap;
		component.vectorSource = mockVectorSource;
		component.currentLength = 10;
		component.lastLineLength = 20;

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should add line interaction on init", () => {
		spyOn(mockMap, "addLayer");
		component.ngOnInit();
		expect(mockMap.addLayer).toHaveBeenCalled();
		expect(mockDrawService.addGlobalInteraction).toHaveBeenCalled();
	});

	it("should emit lineChange event on drawend", () => {
		const mockFeature = new Feature(
			new LineString([
				[0, 0],
				[10, 10],
			]),
		);
		spyOn(component.lineChange, "emit");

		component.addLineInteraction();
		component.draw.dispatchEvent({
			type: "drawend",
			feature: mockFeature,
		} as BaseEvent & { feature: Feature<LineString> });

		expect(component.lineChange.emit).toHaveBeenCalled();
	});

	it("should call calculateLength on geometry change", () => {
		const geometry = new LineString([
			[0, 0],
			[10, 10],
		]);
		const spy = spyOn<any>(component, "calculateLength").and.callThrough();

		component.addLineInteraction();
		component.draw.dispatchEvent({
			type: "drawstart",
			feature: new Feature({ geometry }),
		} as BaseEvent & { feature: Feature<LineString> });

		geometry.dispatchEvent({
			type: "change",
			target: geometry,
		} as BaseEvent);

		expect(spy).toHaveBeenCalled();
		expect((component as any).calculateLength).toHaveBeenCalledWith(geometry);
	});
	it("should calculate length correctly", () => {
		const geometry = new LineString([
			[1, 1],
			[5, 5],
		]);
		expect((component as any).calculateLength(geometry)).toBeCloseTo(628519, 0);
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
});
