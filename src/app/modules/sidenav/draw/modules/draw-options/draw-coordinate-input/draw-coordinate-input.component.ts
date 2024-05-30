import { Component, Input, OnInit } from "@angular/core";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { MapService } from "../../../../../map/map.service";
import { LineString, Polygon } from "ol/geom";
import { DrawService } from "../../../draw.service";
import { SpatialReferenceService } from "../../../../../shared/spatial-reference.service";
import { SpatialReference } from "src/app/modules/shared/interfaces/spatial-reference.interfaces";
import * as proj4x from "proj4";
import { register } from "ol/proj/proj4";
import { TranslocoService } from "@ngneat/transloco";
import { Coordinate, Coordinates } from "../interfaces/draw-options.interface";
import { DrawOptionsTools, ProjectionType } from "../enum/draw-options.enum";

@Component({
	selector: "app-coordinate-input",
	templateUrl: "./draw-coordinate-input.component.html",
	styleUrls: ["./draw-coordinate-input.component.scss"],
})
export class DrawCoordinateInputComponent implements OnInit {
	@Input() public tool: string;

	public spatialReferences: Array<SpatialReference> = [];

	private defaultDegreeProjection: SpatialReference;
	private newProjection: SpatialReference;

	public points: Array<Coordinate> = [{ x: 0, y: 0 }];

	public drawPoint = DrawOptionsTools.Point;
	public drawLine = DrawOptionsTools.Line;
	public drawPolygon = DrawOptionsTools.Polygon;
	public constructor(
		private mapService: MapService,
		private drawService: DrawService,
		private spatialReferenceService: SpatialReferenceService,
		private translocoService: TranslocoService,
	) {}

	public ngOnInit(): void {
		this.getSpatialReferences();
	}

	private getSpatialReferences(): void {
		this.spatialReferenceService.getSpatialReferences().subscribe(
			(data: Array<SpatialReference>) => {
				this.spatialReferences = data;
				this.registerProjections();
				this.setDefaultProjection();
			},

			(error) => {
				const errorMessage = this.translocoService.translate(
					"errorDueToSpecialReference",
				);
				console.error(errorMessage, error);
			},
		);
	}

	private registerProjections(): void {
		const proj4 = (proj4x as any).default;
		this.spatialReferences.forEach((ref) => {
			proj4.defs(ref.name, ref.definition);
		});
		register(proj4);
	}

	private setDefaultProjection(): void {
		if (this.spatialReferences.length > 0) {
			const [firstProjection] = this.spatialReferences;
			this.defaultDegreeProjection = firstProjection;
			this.newProjection = firstProjection;
		}
	}

	private transformCoordinates(point: Coordinate) {
		const proj4 = (proj4x as any).default;
		let [x, y] = [point.x, point.y];
		if (this.newProjection.type === ProjectionType.Metric) {
			[x, y] = proj4(this.newProjection.name, "EPSG:4326", [point.x, point.y]);
		} else if (this.newProjection.type === ProjectionType.Degree) {
			[x, y] = proj4(this.defaultDegreeProjection.name).forward([point.x, point.y]);
		}
		return [x, y];
	}

	private async createFeature(
		coordinates: Coordinates,
		geometryType: DrawOptionsTools,
	) {
		const style = await this.drawService.getStyle(this.tool);
		let feature;

		switch (geometryType) {
			case DrawOptionsTools.Point:
				feature = new Feature({
					geometry: new Point(coordinates[0]),
				});
				break;
			case DrawOptionsTools.Line:
				feature = new Feature({
					geometry: new LineString(coordinates),
				});
				break;
			case DrawOptionsTools.Polygon:
				feature = new Feature({
					geometry: new Polygon([coordinates]),
				});
				break;
		}
		feature.setStyle(style);
		this.mapService.addFeatureToMap(feature);
	}

	public async addPointToMap(): Promise<void> {
		for (const point of this.points) {
			const coordinates = [this.transformCoordinates(point)];
			await this.createFeature(coordinates, DrawOptionsTools.Point);
		}
	}
	public async addLineToMap(): Promise<void> {
		const coordinates = this.points.map((point) =>
			this.transformCoordinates(point),
		);
		coordinates.push(coordinates[0]);
		await this.createFeature(coordinates, DrawOptionsTools.Line);

	}

	public async addPolygonToMap(): Promise<void> {
		if (this.points.length > 2) {
			const coordinates = this.points.map((point) =>
				this.transformCoordinates(point),
			);
			coordinates.push(coordinates[0]);
			await this.createFeature(coordinates, DrawOptionsTools.Polygon);
		} else {
			const errorMessage = this.translocoService.translate(
				"errorDueToNotEnoughPoints",
			);
			console.error(errorMessage);
		}
	}

	public addPoint(): void {
		this.points.push({ x: 0, y: 0 });
	}

	public removePoint(index: number): void {
		if (this.points.length > 1) {
			this.points.splice(index, 1);
		}
	}
	public onChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		const selectedRef = this.spatialReferences.find(
			(ref) => ref.id === +target.value,
		);
		if (selectedRef) {
			this.newProjection = selectedRef;
		}
	}
}
