import { Component, Input } from "@angular/core";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { LineString, Polygon } from "ol/geom";
import { SpatialReference } from "src/app/modules/shared/interfaces/spatial-reference.interfaces";
import * as proj4x from "proj4";
import { TranslocoService } from "@ngneat/transloco";
import { MapService } from "src/app/modules/map/map.service";
import { DrawService } from "../../../../draw.service";
import { DrawTools, ProjectionType } from "../../enum/draw-options.enum";
import {
	CoordinateForDraw,
	CoordinatesForDraw,
} from "../../interfaces/draw-options.interface";
import { SidenavTools } from "src/app/modules/sidenav/enums/sidenav.enums";

@Component({
	selector: "app-coordinate-input",
	templateUrl: "./draw-coordinate-input.component.html",
	styleUrls: ["./draw-coordinate-input.component.scss"],
})
export class DrawCoordinateInputComponent {
	@Input() public tool: string;
	@Input() public showCoordinates: boolean;

	public spatialReferences: Array<SpatialReference> = [];
	private newProjection: SpatialReference;

	public points: Array<CoordinateForDraw> = [{ x: "", y: "" }];

	public drawPoint = DrawTools.Point;
	public drawLine = DrawTools.Line;
	public drawPolygon = DrawTools.Polygon;
	public constructor(
		private mapService: MapService,
		private drawService: DrawService,
		private translocoService: TranslocoService,
	) {}

	public onSelectedReferenceChange(selectedReference: SpatialReference): void {
		this.newProjection = selectedReference;
	}

	private transformCoordinates(point: CoordinateForDraw) {
		const proj4 = (proj4x as any).default;
		let [x, y] = [+point.x, +point.y];

		if (this.newProjection.type === ProjectionType.Metric) {
			[x, y] = proj4(this.newProjection.name, "EPSG:4326", [
				+point.x,
				+point.y,
			]);
		} else if (this.newProjection.type === ProjectionType.Degree) {
			[x, y] = proj4(this.newProjection.name).forward([+point.x, +point.y]);
		}

		return [x, y];
	}

	private async createFeature(
		coordinates: CoordinatesForDraw,
		geometryType: DrawTools,
	) {
		const style = await this.drawService.getStyle(this.tool);
		let feature;

		switch (geometryType) {
			case DrawTools.Point:
				feature = new Feature({
					geometry: new Point(coordinates[0]),
				});
				break;
			case DrawTools.Line:
				feature = new Feature({
					geometry: new LineString(coordinates),
				});
				break;
			case DrawTools.Polygon:
				feature = new Feature({
					geometry: new Polygon([coordinates]),
				});
				break;
		}
		feature.set("sidenavTool", SidenavTools.Draw);
		feature.setStyle(style);
		if (this.showCoordinates && this.tool === "drawPoint") {
			this.drawService.addText(feature, "drawPoint");
		}
		this.mapService.addFeatureToMap(feature);
	}

	public async addPointToMap(): Promise<void> {
		for (const point of this.points) {
			const coordinates = [this.transformCoordinates(point)];
			await this.createFeature(coordinates, DrawTools.Point);
		}
	}
	public async addLineToMap(): Promise<void> {
		const coordinates = this.points.map((point) =>
			this.transformCoordinates(point),
		);
		coordinates.push(coordinates[0]);
		await this.createFeature(coordinates, DrawTools.Line);
	}

	public async addPolygonToMap(): Promise<void> {
		if (this.points.length > 2) {
			const coordinates = this.points.map((point) =>
				this.transformCoordinates(point),
			);
			coordinates.push(coordinates[0]);
			await this.createFeature(coordinates, DrawTools.Polygon);
		} else {
			const errorMessage = this.translocoService.translate(
				"errorDueToNotEnoughPoints",
			);
			console.error(errorMessage);
		}
	}

	public addPoint(): void {
		this.points.push({ x: "", y: "" });
	}

	public removePoint(index: number): void {
		if (this.points.length > 1) {
			this.points.splice(index, 1);
		}
	}

	public removeAllCoordinates() {
		this.points = [{ x: "", y: "" }];
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
