import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DrawDeleteOnClickComponent } from "./draw-delete-on-click.component";
import { EventEmitter, NO_ERRORS_SCHEMA } from "@angular/core";
import { MapService } from "src/app/modules/map/map.service";
import { DrawService } from "../../../../../draw.service";
import { Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

describe("DrawDeleteOnClickComponent", () => {
	let component: DrawDeleteOnClickComponent;
	let fixture: ComponentFixture<DrawDeleteOnClickComponent>;
	let mapServiceMock: jasmine.SpyObj<MapService>;
	let drawServiceMock: jasmine.SpyObj<DrawService>;
	let mapMock: jasmine.SpyObj<Map>;

	beforeEach(async () => {
		mapServiceMock = jasmine.createSpyObj("MapService", [
			"getMap",
			"addCursorToMap",
			"removeFeatureOnMouseClick",
		]);
		drawServiceMock = jasmine.createSpyObj("DrawService", [
			"getVectorLayer",
			"getVectorSource",
		]);
		mapMock = jasmine.createSpyObj<Map>("Map", [], {
			addInteraction: jasmine.createSpy("addInteraction"),
			addEventListener: jasmine.createSpy("addEventListener"),
		});

		await TestBed.configureTestingModule({
			declarations: [DrawDeleteOnClickComponent],
			providers: [
				{ provide: MapService, useValue: mapServiceMock },
				{ provide: DrawService, useValue: drawServiceMock },
			],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DrawDeleteOnClickComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize component and get map from MapService", () => {
		mapServiceMock.getMap.and.returnValue(mapMock);

		component.ngOnInit();

		expect(mapServiceMock.getMap).toHaveBeenCalled();
		expect(component["map"]).toBe(mapMock);
	});

	it("should delete on mouse click and emit interactionDeleted event", () => {
		const emitSpy = spyOn(component.interactionDeleted, "emit");
		drawServiceMock.getVectorLayer.and.returnValue(new VectorLayer({}));
		drawServiceMock.getVectorSource.and.returnValue(new VectorSource({}));

		component.deleteOnMouseClick();

		expect(mapServiceMock.addCursorToMap).toHaveBeenCalled();
		expect(drawServiceMock.getVectorLayer).toHaveBeenCalled();
		expect(drawServiceMock.getVectorSource).toHaveBeenCalled();
		expect(mapServiceMock.removeFeatureOnMouseClick).toHaveBeenCalled();
		expect(emitSpy).toHaveBeenCalled();
	});
});
