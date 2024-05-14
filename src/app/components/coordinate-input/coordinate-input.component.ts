import { Component, Input } from "@angular/core";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { MapService } from "../map/map.service";
import { SpatialReference } from "../spatial-reference.model";
import { SpatialReferenceService } from "../spatial-reference.service";
import { DrawService } from "../sidenav/draw/draw.service";

@Component({
	selector: "app-coordinate-input",
	templateUrl: "./coordinate-input.component.html",
	styleUrls: ["./coordinate-input.component.scss"],
})
export class CoordinateInputComponent {
	@Input() tool: string;
	spatialReferences: Array<SpatialReference> = [];
	selectedSpatialReference: SpatialReference | undefined;
	x = 0;
	y = 0;

	constructor(
		private mapService: MapService,
		private drawService: DrawService,
		private spatialReferenceService: SpatialReferenceService,
	) {}
	getSpatialReferences() {
		this.spatialReferenceService.getSpatialReferences().subscribe(
			(data: { spatialReferences: Array<SpatialReference> }) => {
				this.spatialReferences = data.spatialReferences;
			},
			(error) => {
				console.error("Ошибка при загрузке пространственных ссылок:", error);
			},
		);
	}
	async addPointToMap() {
		if (this.x !== undefined && this.y !== undefined) {
			const point = new Feature({
				geometry: new Point(fromLonLat([this.x, this.y])),
			});
			const pointStyle = await this.drawService.getStyle(this.tool);
			point.setStyle(pointStyle);
			this.mapService.addFeatureToMap(point);
		}
		console.log(this.getSpatialReferences());
	}
}
