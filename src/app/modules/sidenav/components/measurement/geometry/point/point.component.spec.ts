import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PointComponent } from "./point.component";
import { DrawService } from "../../../draw/draw.service";
import { ElevationService } from "src/app/modules/shared/elevation.service";
import { MeasurementService } from "../../measurement.service";
import { Map as MapOpen } from "ol";
import VectorSource from "ol/source/Vector";
import { Point } from "ol/geom";
import { SidenavTools } from "../../../../enums/sidenav.enums";
import { Feature, View } from "ol";
import BaseEvent from "ol/events/Event";
import { Draw, Interaction } from "ol/interaction";
import { FormsModule } from "@angular/forms";
import { getTranslocoModule } from "src/app/modules/shared/transloco/transloco-testing.module";
import { SharedModule } from "src/app/modules/shared/shared.module";
import { Overlay } from "ol";
import { of } from "rxjs";
import { MeasurementMode } from "../../enums/measurement.enum";
import { HttpClientModule } from "@angular/common/http";
import { SpatialReferenceService } from "src/app/modules/shared/spatial-reference.service";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import VectorLayer from "ol/layer/Vector";

describe("PointComponent", () => {
	let component: PointComponent;
	let fixture: ComponentFixture<PointComponent>;
	let mockDrawService: jasmine.SpyObj<DrawService>;
	let mockElevationService: jasmine.SpyObj<ElevationService>;
	let mockMeasurementService: jasmine.SpyObj<MeasurementService>;
	let mockMapOpen: MapOpen;
	let mockVectorSource: VectorSource;
	let mockSpatialReferenceService: jasmine.SpyObj<SpatialReferenceService>;

	beforeEach(() => {
		mockDrawService = jasmine.createSpyObj("DrawService", [
			"addGlobalInteraction",
			"removeGlobalInteraction",
		]);
		mockElevationService = jasmine.createSpyObj("ElevationService", [
			"getCoordinates",
		]);
		mockMeasurementService = jasmine.createSpyObj([
			"getLastIdMeasurement",
			"setStyle",
			"formatMeasurement",
			"setLastId",
		]);
		mockMeasurementService.getLastIdMeasurement.and.returnValue(1);
		mockSpatialReferenceService = jasmine.createSpyObj(
			"SpatialReferenceService",
			["getSpatialReferences"],
		);

		mockSpatialReferenceService.getSpatialReferences.and.returnValue(
			of([
				{
					id: 1,
					name: "EPSG:4326",
					definition: "+proj=longlat +datum=WGS84 +no_defs",
					type: "degree",
				},
			]),
		);

		mockElevationService.getCoordinates.and.returnValue(
			of({
				results: [{ latitude: 0, longitude: 0, elevation: 100 }],
			}),
		);

		TestBed.configureTestingModule({
			declarations: [PointComponent],
			providers: [
				{ provide: DrawService, useValue: mockDrawService },
				{ provide: ElevationService, useValue: mockElevationService },
				{ provide: MeasurementService, useValue: mockMeasurementService },
				{
					provide: SpatialReferenceService,
					useValue: mockSpatialReferenceService,
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

		fixture = TestBed.createComponent(PointComponent);
		component = fixture.componentInstance;

		mockMapOpen = new MapOpen({
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

	it("should reset point correctly", () => {
		spyOn(component.pointChange, "emit");
		component.point = [
			{
				id: 1,
				type: MeasurementMode.Point,
				coordinates: [10, 10],
				feature: new Feature(),
				measureTooltips: new Map<number, Overlay>(),
			},
		];

		component.resetPoint();

		expect(component.pointChange.emit).toHaveBeenCalledWith(null);
		expect(component.point.length).toBe(0);
		expect(component.pointCounter).toBe(0);
	});
});
