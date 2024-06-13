import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PointComponent } from "./point.component";
import { DrawService } from "../../../draw/draw.service";
import { ElevationService } from "src/app/modules/shared/elevation.service";
import { MeasurementService } from "../../measurement.service";
import { Map as MapOpen } from "ol";
import VectorSource from "ol/source/Vector";
import { Point } from "ol/geom";
import { SidenavTools } from "../../../interfaces/sidenav.interface";
import { Feature, View } from "ol";
import BaseEvent from "ol/events/Event";
import { Interaction } from "ol/interaction";
import { FormsModule } from "@angular/forms";
import { getTranslocoModule } from "src/app/modules/shared/transloco/transloco-testing.module";
import { SharedModule } from "src/app/modules/shared/shared.module";
import { Overlay } from "ol";
import { of } from "rxjs";
import { MeasurementMode } from "../../enums/measurement.enum";
import { HttpClientModule } from "@angular/common/http";
import { SpatialReferenceService } from "src/app/modules/shared/spatial-reference.service";

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
		mockMeasurementService = jasmine.createSpyObj("MeasurementService", [
			"getLastIdMeasurement",
			"setLastId",
		]);
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
		});

		fixture = TestBed.createComponent(PointComponent);
		component = fixture.componentInstance;

		mockMapOpen = new MapOpen({
			view: new View({ center: [0, 0], zoom: 2 }),
			layers: [],
			target: document.createElement("div"),
		});
		mockVectorSource = new VectorSource();

		component.map = mockMapOpen;
		component.vectorSource = mockVectorSource;

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should load spatial references on init", () => {
		expect(mockSpatialReferenceService.getSpatialReferences).toHaveBeenCalled();
		expect(component.spatialReferences.length).toBeGreaterThan(0);
	});

	it("should add point interaction on init", () => {
		spyOn(mockMapOpen, "addLayer");
		component.ngOnInit();
		expect(mockMapOpen.addLayer).toHaveBeenCalled();
		expect(mockDrawService.addGlobalInteraction).toHaveBeenCalled();
	});

	it("should emit pointChange event on drawend", async () => {
		const mockPoint = {
			type: MeasurementMode.Point,
			id: 1,
			feature: new Feature(new Point([10, 10])),
			coordinates: [10, 10],
			measureTooltips: new Map<number, Overlay>(),
		};
		spyOn(component.pointChange, "emit");
		spyOn<any>(component, "calculateCoordinates").and.returnValue([10, 10]);
		spyOn<any>(component, "transformCoordinates").and.returnValue([10, 10]);

		component.addPointInteraction();

		(component as any).draw.dispatchEvent({
			type: "drawend",
			feature: mockPoint.feature,
		} as BaseEvent & { feature: Feature<Point> });

		await fixture.whenStable();

		component.pointChange.subscribe((point) => {
			expect(point).toEqual(mockPoint);
		});
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
		spyOn(mockMapOpen.getInteractions(), "getArray").and.returnValue([
			mockInteraction,
		]);

		component.ngOnInit();

		expect(mockDrawService.removeGlobalInteraction).toHaveBeenCalledWith(
			mockMapOpen,
			mockInteraction,
		);
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
