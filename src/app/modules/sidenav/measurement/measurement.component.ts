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
	PointsChangeEvent,
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
	public mode: MeasurementMode = "point";

	public allMeasurements: any = [];

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
		this.allMeasurements.push(...points.slice(-1));
	}
	public onLinesChange(lines: Array<MeasurementLine>) {
		this.allMeasurements.push(...lines.slice(-1));
	}
	public onPolygonsChange(polygon: Array<MeasurementPolygon>) {
		this.allMeasurements.push(...polygon.slice(-1));
	}
	public onCirclesChange(circles: Array<MeasurementCircle>) {
		this.allMeasurements.push(...circles.slice(-1));
	}
}
