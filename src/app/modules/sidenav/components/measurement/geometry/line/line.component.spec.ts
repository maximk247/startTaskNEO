import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LineComponent } from "./line.component";
import { DrawService } from "../../../draw/draw.service";
import { MeasurementService } from "../../measurement.service";
import { Map, View } from "ol";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";
import { LineString } from "ol/geom";
import { MeasurementMode } from "../../enums/measurement.enum";
import VectorSource from "ol/source/Vector";
import { SidenavTools } from "src/app/modules/sidenav/enums/sidenav.enums";
import { getTranslocoModule } from "src/app/modules/shared/transloco/transloco-testing.module";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { CustomDraw } from "src/app/modules/shared/classes/draw-interaction.class";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe("LineComponent", () => {
	let component: LineComponent;
	let fixture: ComponentFixture<LineComponent>;
	let mockDrawService: any;
	let mockMeasurementService: any;

	beforeEach(() => {
		mockDrawService = jasmine.createSpyObj([
			"removeGlobalInteraction",
			"addGlobalInteraction",
		]);
		mockMeasurementService = jasmine.createSpyObj([
			"getLastIdMeasurement",
			"setStyle",
			"formatMeasurement",
			"setLastId",
		]);
		mockMeasurementService.getLastIdMeasurement.and.returnValue(1);

		TestBed.configureTestingModule({
			declarations: [LineComponent],
			providers: [
				{ provide: DrawService, useValue: mockDrawService },
				{ provide: MeasurementService, useValue: mockMeasurementService },
			],
			imports: [getTranslocoModule(), FormsModule, HttpClientModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();

		fixture = TestBed.createComponent(LineComponent);
		component = fixture.componentInstance;
		component.map = new Map({
			layers: [new VectorLayer({ source: new VectorSource() })],
			view: new View({ center: [0, 0], zoom: 2 }),
		});
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize and add interaction on init", () => {
		spyOn(component.map, "addLayer");
		spyOn(component, "addLineInteraction");

		fixture.detectChanges();

		expect(component.map.addLayer).toHaveBeenCalled();
		expect(component.addLineInteraction).toHaveBeenCalled();
	});

	it("should add line interaction", () => {
		fixture.detectChanges();
		component.addLineInteraction();

		expect(mockDrawService.addGlobalInteraction).toHaveBeenCalled();
		expect(component.draw).toBeDefined();
		expect(component.draw.get("sidenavTool")).toBe(SidenavTools.Measurement);
	});

	it("should handle draw start and update length", () => {
		fixture.detectChanges();
		component.addLineInteraction();

		const mockEvent = {
			feature: new Feature({
				geometry: new LineString([
					[0, 0],
					[1, 1],
				]),
			}),
		};
		component.draw.dispatchEvent("drawstart");

		const geometry = mockEvent.feature.getGeometry() as LineString;
		geometry.appendCoordinate([2, 2]);
		geometry.dispatchEvent("change");

		expect(component.currentLength).toBeGreaterThan(0);
	});

	it("should handle draw end and update lines array", () => {
		fixture.detectChanges();
		component.addLineInteraction();

		component.draw.dispatchEvent("drawend");

		expect(component.lines.length).toBe(1);
		expect(component.lines[0].length).toBeDefined();
		expect(mockMeasurementService.setLastId).toHaveBeenCalled();
	});

	it("should reset lines", () => {
		component.lines = [
			{
				id: 1,
				type: MeasurementMode.Line,
				feature: new Feature(),
				length: "100",
			},
		];
		component.resetLine();

		expect(component.lines.length).toBe(0);
		expect(component.lineCounter).toBe(0);
		expect(component.currentLength).toBe(0);
		expect(component.lastLineLength).toBe(0);
	});
});
