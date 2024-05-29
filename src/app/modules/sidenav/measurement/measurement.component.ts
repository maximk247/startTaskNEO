import { Component, OnInit } from "@angular/core";
import MapOpen from "ol/Map";
import { Overlay } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {
	MeasurementCircle,
	MeasurementLine,
	MeasurementPolygon,
	MeasurementPoint,
	MeasurementMode,
} from "./interfaces/measurement.interface";
import { MapService } from "../../map/map.service";
import { DrawService } from "../draw/draw.service";

@Component({
	selector: "app-measurement",
	templateUrl: "./measurement.component.html",
	styleUrls: ["./measurement.component.scss"],
})
export class MeasurementComponent implements OnInit {
	public map: MapOpen;
	public vectorSource: VectorSource;
	private measureTooltips: Map<number, Overlay> = new Map();
	public points: Array<MeasurementPoint> = [];
	public lines: Array<MeasurementLine> = [];
	public polygons: Array<MeasurementPolygon> = [];
	public circles: Array<MeasurementCircle> = [];
	public pointCounter = 1;
	public lineCounter = 1;
	public polygonCounter = 1;
	public circleCounter = 1;
	public mode: MeasurementMode = "point";

	public constructor(
		private mapService: MapService,
		private drawService: DrawService,
	) {}

	public ngOnInit() {
		this.vectorSource = new VectorSource();

		this.map = this.mapService.getMap();

		this.map.addLayer(
			new VectorLayer({
				source: this.vectorSource,
			}),
		);
		const interactions = this.map.getInteractions().getArray();
		interactions.forEach((interaction) => {
			if (interaction.get("drawType")) {
				this.drawService.removeGlobalInteraction(this.map, interaction);
			}
		});
	}

	public onPointsChange(points: Array<MeasurementPoint>) {
		this.points.push(...points.slice(-1));
	}
	public onLinesChange(lines: Array<MeasurementLine>) {
		this.lines.push(...lines.slice(-1));
	}
	public onPolygonsChange(polygon: Array<MeasurementPolygon>) {
		this.polygons.push(...polygon.slice(-1));
	}
	public onCirclesChange(circles: Array<MeasurementCircle>) {
		this.circles.push(...circles.slice(-1));
	}

	public removePoint(id: number) {
		const point = this.points.find((point) => point.id === id);
		if (point) {
			this.vectorSource.removeFeature(point.feature);
			this.points = this.points.filter((p) => p.id !== id);
		}

		const tooltip = this.measureTooltips.get(id);
		if (tooltip) {
			this.map.removeOverlay(tooltip);
			this.measureTooltips.delete(id);
		}
		if (this.points.length === 0) {
			this.pointCounter = 1;
		}
	}
	public removeLine(id: number) {
		const line = this.lines.find((line) => line.id === id);
		if (line) {
			this.vectorSource.removeFeature(line.feature);
			this.lines = this.lines.filter((l) => l.id !== id);
		}
		if (this.lines.length === 0) {
			this.lineCounter = 1;
		}
	}

	public removePolygon(id: number) {
		const polygon = this.polygons.find((polygon) => polygon.id === id);
		if (polygon) {
			this.vectorSource.removeFeature(polygon.feature);
			this.polygons = this.polygons.filter((p) => p.id !== id);
		}

		if (this.polygons.length === 0) {
			this.polygonCounter = 1;
		}
	}

	public removeCircle(id: number) {
		const circle = this.circles.find((circle) => circle.id === id);
		if (circle) {
			this.vectorSource.removeFeature(circle.feature);
			this.circles = this.circles.filter((c) => c.id !== id);
		}

		if (this.circles.length === 0) {
			this.circleCounter = 1;
		}
	}
}
