import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DrawPointComponent } from "./draw-point.component";
import { DrawService } from "../../../../draw.service";
import { MapService } from "src/app/modules/map/map.service";
import { Map, Feature } from "ol";
import { of, Subject } from "rxjs";
import { Point } from "ol/geom";
import { Tools } from "../../../../enum/draw.enum";
import { SidenavTools } from "src/app/modules/sidenav/enums/sidenav.enums";
import { getTranslocoModule } from "src/app/modules/shared/transloco/transloco-testing.module";
import { DrawSizeComponent } from "../../../draw-options/components/draw-size/draw-size.component";
import { DrawTransparencyComponent } from "../../../draw-options/components/draw-transparency/draw-transparency.component";
import { DrawCoordinateInputComponent } from "../../../draw-options/components/draw-coordinate-input/draw-coordinate-input.component";
import { DrawColorComponent } from "../../../draw-options/components/draw-color/draw-color.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSliderModule } from "@angular/material/slider";
import { FormsModule } from "@angular/forms";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";

describe("DrawPointComponent", () => {
	let component: DrawPointComponent;
	let fixture: ComponentFixture<DrawPointComponent>;
	let mockDrawService: jasmine.SpyObj<DrawService>;
	let mockMapService: jasmine.SpyObj<MapService>;
	let mockMap: jasmine.SpyObj<Map>;
	let alphaChangedSubject: Subject<number>;
	let colorChangedSubject: Subject<string>;
	let coordinatesChangedSubject: Subject<void>;

	beforeEach(async () => {
		alphaChangedSubject = new Subject<number>();
		colorChangedSubject = new Subject<string>();
		coordinatesChangedSubject = new Subject<void>();
		mockDrawService = jasmine.createSpyObj(
			"DrawService",
			[
				"getSize",
				"getShowCoordinates",
				"addText",
				"removeText",
				"setPointShape",
				"getPointShape",
				"setShowCoordinates",
				"getColor",
				"getAlpha",
			],
			{
				alphaChanged: alphaChangedSubject.asObservable(),
				colorChanged: colorChangedSubject.asObservable(),
				coordinatesChanged: coordinatesChangedSubject.asObservable(),
			},
		);

		mockMapService = jasmine.createSpyObj("MapService", [
			"getMap",
			"checkFeature",
			"getAllFeatures",
		]);

		mockMap = jasmine.createSpyObj("Map", [""]);

		await TestBed.configureTestingModule({
			declarations: [
				DrawPointComponent,
				DrawSizeComponent,
				DrawTransparencyComponent,
				DrawColorComponent,
				DrawCoordinateInputComponent,
			],
			providers: [
				{ provide: DrawService, useValue: mockDrawService },
				{ provide: MapService, useValue: mockMapService },
			],
			imports: [
				getTranslocoModule(),
				MatDialogModule,
				MatSliderModule,
				FormsModule,
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DrawPointComponent);
		component = fixture.componentInstance;
		mockMapService.getMap.and.returnValue(mockMap);
		mockDrawService.getSize.and.returnValue(10);
		mockDrawService.getShowCoordinates.and.returnValue(true);

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize map, pointSize, and showCoordinatesFlag on ngOnInit", () => {
		component.ngOnInit();
		expect(mockMapService.getMap).toHaveBeenCalled();
		expect(component["map"]).toBe(mockMap);
		expect(mockDrawService.getSize).toHaveBeenCalledWith(component.tool);
		expect(component.pointSize).toBe(10);
		expect(mockDrawService.getShowCoordinates).toHaveBeenCalled();
		expect(component.showCoordinatesFlag).toBe(true);
	});

	it("should check feature in ngDoCheck", () => {
		mockMapService.checkFeature.and.returnValue(true);
		component.ngDoCheck();
		expect(mockMapService.checkFeature).toHaveBeenCalledWith(
			component["map"],
			"sidenavTool",
			SidenavTools.Draw,
			"Point",
		);
		expect(component.showCoordinatesFlag).toBe(true);
	});

	it("should update coordinates and add text to features", () => {
		const feature = new Feature({ geometry: new Point([0, 0]) });
		mockMapService.getAllFeatures.and.returnValue([feature]);

		component.showCoordinates = true;
		component["updateCoordinates"]();

		expect(mockMapService.getAllFeatures).toHaveBeenCalledWith(
			component["map"],
			"sidenavTool",
			SidenavTools.Draw,
		);
		expect(mockDrawService.addText).toHaveBeenCalledWith(feature, Tools.Point);
	});

	it("should update coordinates and remove text from features", () => {
		const feature = new Feature({ geometry: new Point([0, 0]) });
		mockMapService.getAllFeatures.and.returnValue([feature]);

		component.showCoordinates = false;
		component["updateCoordinates"]();

		expect(mockMapService.getAllFeatures).toHaveBeenCalledWith(
			component["map"],
			"sidenavTool",
			SidenavTools.Draw,
		);
		expect(mockDrawService.removeText).toHaveBeenCalledWith(feature);
	});

	it("should set point shape", () => {
		component.setPointShape("circle");
		expect(mockDrawService.setPointShape).toHaveBeenCalledWith("circle");
	});

	it("should get active shape", () => {
		mockDrawService.getPointShape.and.returnValue("circle");
		expect(component.getActive("circle")).toBe("active");
		expect(component.getActive("square")).toBe("");
	});

	it("should update point size", () => {
		spyOn(component.pointSizeChange, "emit");
		component.pointSize = 15;
		component.updatePointSize();
		expect(component.pointSizeChange.emit).toHaveBeenCalledWith(15);
	});

	it("should toggle show coordinates", () => {
		component.showCoordinates = false;
		component.showCoordinatesChange();
		expect(component.showCoordinates).toBe(true);
		expect(mockDrawService.setShowCoordinates).toHaveBeenCalledWith(true);
	});
});
