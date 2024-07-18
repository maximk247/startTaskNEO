import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { SpatialReferenceService } from "src/app/modules/shared/spatial-reference.service";
import { TranslocoService } from "@ngneat/transloco";
import { CoordinateSystemService } from "./coordintate-system.service";
import { CoordinateSystemComponent } from "./coordinate-system.component";
import { SpatialReference } from "src/app/modules/shared/interfaces/spatial-reference.interfaces";

describe("CoordinateSystemComponent", () => {
	let component: CoordinateSystemComponent;
	let fixture: ComponentFixture<CoordinateSystemComponent>;
	let mockSpatialReferenceService: any;
	let mockTranslocoService: any;
	let mockCoordinateSystemService: any;

	beforeEach(() => {
		mockSpatialReferenceService = jasmine.createSpyObj([
			"getSpatialReferences",
		]);
		mockTranslocoService = jasmine.createSpyObj(["translate"]);
		mockCoordinateSystemService = jasmine.createSpyObj(["setProjection"]);

		TestBed.configureTestingModule({
			declarations: [CoordinateSystemComponent],
			providers: [
				{
					provide: SpatialReferenceService,
					useValue: mockSpatialReferenceService,
				},
				{ provide: TranslocoService, useValue: mockTranslocoService },
				{
					provide: CoordinateSystemService,
					useValue: mockCoordinateSystemService,
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(CoordinateSystemComponent);
		component = fixture.componentInstance;
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should get spatial references on init", () => {
		const spatialReferences: Array<SpatialReference> = [
			{
                id: 1, name: "EPSG:4326", definition: "some-definition",
                type: ""
            },
		];
		mockSpatialReferenceService.getSpatialReferences.and.returnValue(
			of(spatialReferences),
		);

		fixture.detectChanges();

		expect(component.spatialReferences).toEqual(spatialReferences);
		expect(mockSpatialReferenceService.getSpatialReferences).toHaveBeenCalled();
		expect(component.currentProjection).toEqual(spatialReferences[0]);
	});

	it("should handle error when fetching spatial references", () => {
		const error = new Error("some error");
		mockSpatialReferenceService.getSpatialReferences.and.returnValue(
			throwError(error),
		);
		mockTranslocoService.translate.and.returnValue(
			"errorDueToSpecialReference",
		);

		fixture.detectChanges();

		expect(mockSpatialReferenceService.getSpatialReferences).toHaveBeenCalled();
		expect(mockTranslocoService.translate).toHaveBeenCalledWith(
			"errorDueToSpecialReference",
		);
	});

});
