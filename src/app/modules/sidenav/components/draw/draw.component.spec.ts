import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DrawComponent } from "./draw.component";
import { MapService } from "../../../map/map.service";
import { DrawService } from "./draw.service";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import Map from "ol/Map";
import { of } from "rxjs";

describe("DrawComponent", () => {
	let component: DrawComponent;
	let fixture: ComponentFixture<DrawComponent>;
	let mapServiceMock: any;
	let drawServiceMock: any;

	beforeEach(async () => {
		mapServiceMock = {
			getMap: jasmine.createSpy("getMap").and.returnValue({
				getInteractions: jasmine.createSpy("getInteractions").and.returnValue({
					getArray: jasmine.createSpy("getArray").and.returnValue([]),
				}),
				addLayer: jasmine.createSpy("addLayer"),
			}),
			addCursorToMap: jasmine.createSpy("addCursorToMap"),
			removeClickHandler: jasmine.createSpy("removeClickHandler"),
		};

		drawServiceMock = {
			removeGlobalInteraction: jasmine.createSpy("removeGlobalInteraction"),
			initializeLayer: jasmine.createSpy("initializeLayer"),
			getVectorLayer: jasmine.createSpy("getVectorLayer").and.returnValue({}),
			resetDrawFeatures: jasmine.createSpy("resetDrawFeatures"),
			setSize: jasmine.createSpy("setSize"),
			initializePoint: jasmine.createSpy("initializePoint").and.returnValue({}),
			initializeLine: jasmine.createSpy("initializeLine").and.returnValue({}),
			initializePolygon: jasmine
				.createSpy("initializePolygon")
				.and.returnValue({}),
			initializeFreeLine: jasmine
				.createSpy("initializeFreeLine")
				.and.returnValue({}),
			initializeFreePolygon: jasmine
				.createSpy("initializeFreePolygon")
				.and.returnValue({}),
			initializeFigure: jasmine
				.createSpy("initializeFigure")
				.and.returnValue({}),
			addGlobalInteraction: jasmine.createSpy("addGlobalInteraction"),
		};

		await TestBed.configureTestingModule({
			declarations: [DrawComponent],
			providers: [
				{ provide: MapService, useValue: mapServiceMock },
				{ provide: DrawService, useValue: drawServiceMock },
			],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DrawComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize map on ngOnInit", () => {
		component.ngOnInit();
		expect(mapServiceMock.getMap).toHaveBeenCalled();
		expect(drawServiceMock.initializeLayer).toHaveBeenCalled();
		expect(drawServiceMock.getVectorLayer).toHaveBeenCalled();
		expect(drawServiceMock.resetDrawFeatures).toHaveBeenCalled();
		expect(mapServiceMock.addCursorToMap).toHaveBeenCalled();
	});

	it("should set correct visibility when drawPoint is called", () => {
		component.drawPoint();
		expect(component.componentVisibility.drawPoint).toBeTrue();
		expect(drawServiceMock.removeGlobalInteraction).toHaveBeenCalled();
		expect(drawServiceMock.initializePoint).toHaveBeenCalled();
		expect(drawServiceMock.addGlobalInteraction).toHaveBeenCalled();
		expect(mapServiceMock.addCursorToMap).toHaveBeenCalledWith("DrawPoint");
	});

	it("should set correct visibility when drawLine is called", () => {
		component.drawLine();
		expect(component.componentVisibility.drawLine).toBeTrue();
		expect(drawServiceMock.removeGlobalInteraction).toHaveBeenCalled();
		expect(drawServiceMock.initializeLine).toHaveBeenCalled();
		expect(drawServiceMock.addGlobalInteraction).toHaveBeenCalled();
		expect(mapServiceMock.addCursorToMap).toHaveBeenCalledWith("DrawLine");
	});

	it("should set correct visibility when drawPolygon is called", () => {
		component.drawPolygon();
		expect(component.componentVisibility.drawPolygon).toBeTrue();
		expect(drawServiceMock.removeGlobalInteraction).toHaveBeenCalled();
		expect(drawServiceMock.initializePolygon).toHaveBeenCalled();
		expect(drawServiceMock.addGlobalInteraction).toHaveBeenCalled();
		expect(mapServiceMock.addCursorToMap).toHaveBeenCalledWith("DrawPolygon");
	});

	it("should set correct visibility when drawFreeLine is called", () => {
		component.drawFreeLine();
		expect(component.componentVisibility.drawFreeLine).toBeTrue();
		expect(drawServiceMock.removeGlobalInteraction).toHaveBeenCalled();
		expect(drawServiceMock.initializeFreeLine).toHaveBeenCalled();
		expect(drawServiceMock.addGlobalInteraction).toHaveBeenCalled();
		expect(mapServiceMock.addCursorToMap).toHaveBeenCalledWith("DrawLine");
	});

	it("should set correct visibility when drawFreePolygon is called", () => {
		component.drawFreePolygon();
		expect(component.componentVisibility.drawFreePolygon).toBeTrue();
		expect(drawServiceMock.removeGlobalInteraction).toHaveBeenCalled();
		expect(drawServiceMock.initializeFreePolygon).toHaveBeenCalled();
		expect(drawServiceMock.addGlobalInteraction).toHaveBeenCalled();
		expect(mapServiceMock.addCursorToMap).toHaveBeenCalledWith("DrawPolygon");
	});

	it("should set correct visibility when drawFigure is called", () => {
		component.drawFigure();
		expect(component.componentVisibility.drawFigure).toBeTrue();
		expect(drawServiceMock.removeGlobalInteraction).toHaveBeenCalled();
		expect(drawServiceMock.initializeFigure).toHaveBeenCalledWith(
			(component as any).map,
			"Circle",
		);
		expect(drawServiceMock.addGlobalInteraction).toHaveBeenCalled();
		expect(mapServiceMock.addCursorToMap).toHaveBeenCalledWith("DrawPolygon");
	});

	it("should correctly update size for a tool", () => {
		const size = 5;
		const tool = "drawPoint";
		component.updateSize(size, tool);
		expect(drawServiceMock.setSize).toHaveBeenCalledWith(size, tool);
	});

	it("should delete active interaction", () => {
		component.deleteActiveInteraction();
		expect(drawServiceMock.removeGlobalInteraction).toHaveBeenCalledWith(
			(component as any).map,
			(component as any).activeInteraction,
		);
	});

	it("should correctly identify the active tool", () => {
		component.componentVisibility.drawLine = true;
		const activeTool = (component as any).findActiveTool(
			component.componentVisibility,
		);
		expect(activeTool).toBe("drawLine");
	});

	it("should return active-tool class for active tool", () => {
		component.componentVisibility.drawLine = true;
		const activeToolClass = component.getActiveTool("drawLine");
		expect(activeToolClass).toBe("active-tool");
	});

	it("should not return active-tool class for inactive tool", () => {
		component.componentVisibility.drawLine = false;
		const activeToolClass = component.getActiveTool("drawLine");
		expect(activeToolClass).toBe("");
	});

	it("should reset component visibility", () => {
		component.componentVisibility.drawLine = true;
		(component as any).resetComponentVisibility();
		for (const key in component.componentVisibility) {
			expect(component.componentVisibility[key]).toBeFalse();
		}
	});

	it("should set correct visibility when deleteOnClick is called", () => {
		component.deleteOnClick();
		expect(component.componentVisibility.deleteOnClick).toBeTrue();
	});
});
