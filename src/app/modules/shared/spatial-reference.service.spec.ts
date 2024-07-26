import { TestBed } from "@angular/core/testing";
import {
	HttpClientTestingModule,
	HttpTestingController,
} from "@angular/common/http/testing";
import { SpatialReferenceService } from "./spatial-reference.service";
import { SpatialReference } from "./interfaces/spatial-reference.interfaces";

describe("SpatialReferenceService", () => {
	let service: SpatialReferenceService;
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [SpatialReferenceService],
		});
		service = TestBed.inject(SpatialReferenceService);
		httpTestingController = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});

	it("should call getSpatialReferences and return expected data", () => {
		const mockResponse: Array<SpatialReference> = [
			{
				id: 1,
				name: "WGS 84",
				definition: "EPSG:4326",
				type: "degree",
			},
			{
				id: 2,
				name: "NAD83 / UTM zone 10N",
				definition: "EPSG:26910",
				type: "metric",
			},
		];

		service.getSpatialReferences().subscribe((data) => {
			expect(data).toEqual(mockResponse);
		});

		const req = httpTestingController.expectOne(
			"http://gs-yung.neostk.com/neoportal/api/gisp-api/SpatialReferences?mapId=1&api-version=2",
		);
		expect(req.request.method).toBe("GET");
		req.flush(mockResponse);
	});
});
