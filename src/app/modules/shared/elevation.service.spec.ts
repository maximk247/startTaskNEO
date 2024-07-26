import { TestBed } from "@angular/core/testing";
import {
	HttpClientTestingModule,
	HttpTestingController,
} from "@angular/common/http/testing";
import { ElevationService } from "./elevation.service";
import { ElevationArray } from "./interfaces/elevation.interfaces";
import { Coordinate } from "ol/coordinate";

describe("ElevationService", () => {
	let service: ElevationService;
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [ElevationService],
		});
		service = TestBed.inject(ElevationService);
		httpTestingController = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});

	it("should call getCoordinates and return expected data", () => {
		const mockCoordinates: Coordinate = [40.748817, -73.985428];
		const mockResponse: ElevationArray = {
			results: [
				{
					latitude: 40.748817,
					longitude: -73.985428,
					elevation: 10,
				},
			],
		};

		service.getCoordinates(mockCoordinates).subscribe((data) => {
			expect(data).toEqual(mockResponse);
		});

		const req = httpTestingController.expectOne(
			"https://api.open-elevation.com/api/v1/lookup?locations=40.748817,-73.985428",
		);
		expect(req.request.method).toBe("GET");
		req.flush(mockResponse);
	});
});
