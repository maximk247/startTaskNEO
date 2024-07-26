import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DrawShapeComponent } from "./draw-shape.component";
import { DrawService } from "../../../../draw.service";
import { MapService } from "src/app/modules/map/map.service";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import Map from "ol/Map";
import Draw, { createRegularPolygon, createBox } from "ol/interaction/Draw";
import { DrawShapes } from "../../enum/draw-options.enum";
import Collection from "ol/Collection";
import Interaction from "ol/interaction/Interaction";
import { Type } from "ol/geom/Geometry";

describe("DrawShapeComponent", () => {
	let component: DrawShapeComponent;
	let fixture: ComponentFixture<DrawShapeComponent>;
	let drawServiceStub: Partial<DrawService>;
	let mapServiceStub: Partial<MapService>;
	let mockMap: jasmine.SpyObj<Map>;
	let mockInteractions: jasmine.SpyObj<Collection<Interaction>>;

	beforeEach(async () => {
		drawServiceStub = {
			removeGlobalInteraction: jasmine.createSpy("removeGlobalInteraction"),
			initializeFigure: jasmine.createSpy("initializeFigure").and.callThrough(),
		};

		mockInteractions = jasmine.createSpyObj("Collection", ["getArray"]);
		mockInteractions.getArray.and.returnValue([]);

		mockMap = jasmine.createSpyObj("Map", [
			"getInteractions",
			"addInteraction",
		]);
		mockMap.getInteractions.and.returnValue(mockInteractions);

		mapServiceStub = {
			getMap: jasmine.createSpy("getMap").and.returnValue(mockMap),
		};

		await TestBed.configureTestingModule({
			declarations: [DrawShapeComponent],
			providers: [
				{ provide: DrawService, useValue: drawServiceStub },
				{ provide: MapService, useValue: mapServiceStub },
			],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();

		fixture = TestBed.createComponent(DrawShapeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize map and default figure shape on ngOnInit", () => {
		component.ngOnInit();
		expect(mapServiceStub.getMap).toHaveBeenCalled();
		expect(component["map"]).toBe(mockMap);
		expect(component["figureShape"]).toBe(DrawShapes.Circle);
	});

	it("should add draw interaction for Circle", () => {
		component.addDrawInteraction(DrawShapes.Circle);
		expect(drawServiceStub.removeGlobalInteraction).toHaveBeenCalledWith(
			mockMap,
		);
		expect(component["figureShape"]).toBe(DrawShapes.Circle);
		if (component.activeInteraction) {
			expect(mockMap.addInteraction).toHaveBeenCalledWith(
				component.activeInteraction,
			);
		}
	});

	it("should add draw interaction for Square", () => {
		component.addDrawInteraction(DrawShapes.Square);
		expect(drawServiceStub.removeGlobalInteraction).toHaveBeenCalledWith(
			mockMap,
		);
		expect(component["figureShape"]).toBe(DrawShapes.Square);
		if (component.activeInteraction) {
			expect(mockMap.addInteraction).toHaveBeenCalledWith(
				component.activeInteraction,
			);
		}
	});

	it("should add draw interaction for Rectangle", () => {
		component.addDrawInteraction(DrawShapes.Rectangle);
		expect(drawServiceStub.removeGlobalInteraction).toHaveBeenCalledWith(
			mockMap,
		);
		expect(component["figureShape"]).toBe(DrawShapes.Rectangle);
		if (component.activeInteraction) {
			expect(mockMap.addInteraction).toHaveBeenCalledWith(
				component.activeInteraction,
			);
		}
	});

	it("should add draw interaction for Triangle", () => {
		component.addDrawInteraction(DrawShapes.Triangle);
		expect(drawServiceStub.removeGlobalInteraction).toHaveBeenCalledWith(
			mockMap,
		);
		expect(component["figureShape"]).toBe(DrawShapes.Triangle);
		if (component.activeInteraction) {
			expect(mockMap.addInteraction).toHaveBeenCalledWith(
				component.activeInteraction,
			);
		}
	});

	it("should add draw interaction for Arrow", () => {
		component.addDrawInteraction(DrawShapes.Arrow);
		expect(drawServiceStub.removeGlobalInteraction).toHaveBeenCalledWith(
			mockMap,
		);
		expect(component["figureShape"]).toBe(DrawShapes.Arrow);
		if (component.activeInteraction) {
			expect(mockMap.addInteraction).toHaveBeenCalledWith(
				component.activeInteraction,
			);
		}
	});

	it("should return 'active-figure-shape' when shape is active", () => {
		component["figureShape"] = DrawShapes.Circle;
		expect(component.getActiveFigureShape(DrawShapes.Circle)).toBe(
			"active-figure-shape",
		);
		expect(component.getActiveFigureShape(DrawShapes.Square)).toBe("");
	});
});
