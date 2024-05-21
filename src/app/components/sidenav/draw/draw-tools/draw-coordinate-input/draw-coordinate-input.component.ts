import { Component, Input } from "@angular/core";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { MapService } from "../../../../map/map.service";
import { SpatialReference } from "../../../../../spatial-reference.model";
import { SpatialReferenceService } from "../../../../spatial-reference.service";
import { DrawService } from "../../draw.service";

@Component({
	selector: "app-coordinate-input",
	templateUrl: "./draw-coordinate-input.component.html",
	styleUrls: ["./draw-coordinate-input.component.scss"],
})
export class DrawCoordinateInputComponent {
	@Input() public tool: string;
	public spatialReferences: Array<SpatialReference> = [];
	public selectedSpatialReference: SpatialReference | undefined;
	public x = 0;
	public y = 0;

	public constructor(
		private mapService: MapService,
		private drawService: DrawService,
		private spatialReferenceService: SpatialReferenceService,
	) {}
	public getSpatialReferences() {
		this.spatialReferenceService.getSpatialReferences().subscribe(
			(data: { spatialReferences: Array<SpatialReference> }) => {
				this.spatialReferences = data.spatialReferences;
			},
			(error) => {
				console.error("Ошибка при загрузке пространственных ссылок:", error);
			},
		);
	}
	public async addPointToMap() {
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
