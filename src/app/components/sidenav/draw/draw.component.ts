import { Component, OnInit } from "@angular/core";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import VectorSource from "ol/source/Vector";
import { MapService } from "../../map/map.service";
import {
	Circle as CircleStyle,
	Fill,
	RegularShape,
	Stroke,
	Style,
} from "ol/style";
import Feature from "ol/Feature";
import { DrawService } from "./draw.service";

@Component({
	selector: "app-draw",
	templateUrl: "./draw.component.html",
	styleUrls: ["./draw.component.scss"],
})
export class DrawComponent implements OnInit {
	map: Map;
	pointStyle = "Circle";
	vectorLayer: VectorLayer<VectorSource>;
	source: VectorSource;
	drawnFeatures: Array<Feature> = [];

	constructor(
		private mapService: MapService,
		private drawService: DrawService,
	) {}

	ngOnInit() {
		this.map = this.mapService.getMap();
		const vectorLayer = this.drawService.initalizeLayer(this.source);
		this.map.addLayer(vectorLayer);
	}
	setPointStyle(style: string) {
		this.pointStyle = style;
	}
	drawPoint() {
		const draw = this.drawService.initializePoint(this.map);

		draw.on("drawend", (event) => {
			this.drawnFeatures.push(event.feature);
			event.feature.setStyle(this.drawService.getPointStyle(this.pointStyle));
		});
	}

	drawLine() {
		const draw = this.drawService.initializeLineString(this.map);
		this.map.addInteraction(draw);
	}

	drawPolygon() {
		const draw = this.drawService.initializePolygon(this.map);
		this.map.addInteraction(draw);
	}

	drawFreeLine() {
		const draw = this.drawService.initalizeFreeLineString(this.map);
		this.map.addInteraction(draw);
	}

	drawFreePolygon() {
		const draw = this.drawService.initalizeFreePolygon(this.map);
		this.map.addInteraction(draw);
	}

	drawCircle() {
		const draw = this.drawService.initializeCircle(this.map);
		this.map.addInteraction(draw);
	}
}
