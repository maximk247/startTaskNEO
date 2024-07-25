import { TestBed } from "@angular/core/testing";

import * as proj4x from "proj4";
import { ProjectionType } from "src/app/modules/sidenav/components/draw/draw-modules/draw-options/enum/draw-options.enum";
import { CoordinateSystemService } from "./coordintate-system.service";

describe("CoordinateSystemService", () => {
	let service: CoordinateSystemService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CoordinateSystemService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});

	it("should set and get projection correctly", () => {
		const projection = { name: "EPSG:4326", type: ProjectionType.Degree };
		service.setProjection(projection);
		expect(service.getProjection()).toEqual(projection);
	});

	it("should transform coordinates correctly for Metric projection", () => {
		const projection = { name: "EPSG:3857", type: ProjectionType.Metric };
		service.setProjection(projection);
		const coordinate = [40.7128, -74.006];
		const transformed = service.transformCoordinates(coordinate);
		const proj4 = (proj4x as any).default;
		const expected = proj4("EPSG:3857").forward(coordinate);
		expect(transformed).toEqual(expected);
	});

	it("should transform coordinates correctly for Degree projection", () => {
		const projection = { name: "EPSG:4326", type: ProjectionType.Degree };
		service.setProjection(projection);
		const coordinate = [40.7128, -74.006];
		const transformed = service.transformCoordinates(coordinate);
		const proj4 = (proj4x as any).default;
		const expected = proj4("EPSG:4326").forward(coordinate);
		expect(transformed).toEqual(expected);
	});

	it("should return the same coordinates if no projection is set", () => {
		const coordinate = [40.7128, -74.006];
		const transformed = service.transformCoordinates(coordinate);
		expect(transformed).toEqual(coordinate);
	});
});
