import { Component, Input, OnInit } from "@angular/core";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { MapService } from "../../../../map/map.service";
import { SpatialReferenceService } from "../../../../shared/spatial-reference.service";
import { DrawService } from "../../draw.service";
import { SpatialReference } from "src/app/modules/shared/interfaces/spatial-reference.interfaces";
import * as proj4x from "proj4";
import { LineString, Polygon } from "ol/geom";
import { register } from "ol/proj/proj4";

@Component({
	selector: "app-coordinate-input",
	templateUrl: "./draw-coordinate-input.component.html",
	styleUrls: ["./draw-coordinate-input.component.scss"],
})
export class DrawCoordinateInputComponent implements OnInit {
	@Input() public tool: string;
	public spatialReferences: Array<SpatialReference> = [];

	private currentProjection: SpatialReference;
	private newProjection: SpatialReference;
	public points: Array<{ x: number; y: number }> = [{ x: 0, y: 0 }];
	public drawPoint = "drawPoint";
	public drawLine = "drawLine";
	public drawPolygon = "drawPolygon";
	public constructor(
		private mapService: MapService,
		private drawService: DrawService,
		private spatialReferenceService: SpatialReferenceService,
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
				console.error("Ошибка при загрузке пространственных ссылок:", error);
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
			this.currentProjection = this.spatialReferences[0];
			this.newProjection = this.currentProjection;
		}
	}

	public async addPointToMap(): Promise<void> {
		const proj4 = (proj4x as any).default;

		const pointStyle = await this.drawService.getStyle(this.tool);
		console.log(this.currentProjection.name, this.newProjection.name);

		this.points.forEach((point) => {
			let x = point.x;
			let y = point.y;

			if (this.newProjection.type === "metric") {
				[x, y] = proj4(this.newProjection.name, "EPSG:4326", [
					point.x,
					point.y,
				]);
			} else if (this.newProjection.type === "degree") {
				[x, y] = proj4(this.newProjection.name).forward([point.x, point.y]);
			}

			const feature = new Feature({
				geometry: new Point([x, y]),
			});

			feature.setStyle(pointStyle);
			this.mapService.addFeatureToMap(feature);
		});

		this.currentProjection.name = this.newProjection.name;
	}
	public async addLineToMap(): Promise<void> {
		const proj4 = (proj4x as any).default;
		const lineStyle = await this.drawService.getStyle(this.tool);

		const coordinates = this.points.map((point) => {
			let x = point.x;
			let y = point.y;

			if (this.newProjection.type === "metric") {
				[x, y] = proj4(this.newProjection.name, "EPSG:4326", [
					point.x,
					point.y,
				]);
			} else if (this.newProjection.type === "degree") {
				[x, y] = proj4(this.newProjection.name).forward([point.x, point.y]);
			}

			return [x, y];
		});

		coordinates.push(coordinates[0]);

		const line = new Feature({
			geometry: new LineString(coordinates),
		});

		line.setStyle(lineStyle);
		this.mapService.addFeatureToMap(line);

		this.currentProjection.name = this.newProjection.name;
	}

	public async addPolygonToMap(): Promise<void> {
		if (this.points.length > 2) {
			if (this.currentProjection && this.newProjection) {
				const proj4 = (proj4x as any).default;
				const coordinates = this.points.map((point) => {
					let x = point.x;
					let y = point.y;

					if (this.newProjection.type === "metric") {
						[x, y] = proj4(this.newProjection.name, "EPSG:4326", [
							point.x,
							point.y,
						]);
					} else if (this.newProjection.type === "degree") {
						[x, y] = proj4(this.newProjection.name).forward([point.x, point.y]);
					}

					return [x, y];
				});

				coordinates.push(coordinates[0]);
				console.log(coordinates);
				const polygon = new Feature({
					geometry: new Polygon([coordinates]),
				});

				const polygonStyle = await this.drawService.getStyle(this.tool);
				polygon.setStyle(polygonStyle);

				this.mapService.addFeatureToMap(polygon);

				this.currentProjection.name = this.newProjection.name;
			} else {
				console.error("Current or new projection is not defined.");
				console.log(this.currentProjection, this.newProjection);
			}
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
