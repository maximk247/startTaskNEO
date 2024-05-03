import { Component, OnInit, Output } from "@angular/core";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import VectorSource from "ol/source/Vector";
import { MapService } from "../../map/map.service";
import Feature from "ol/Feature";
import { DrawService } from "./draw.service";

@Component({
	selector: "app-draw",
	templateUrl: "./draw.component.html",
	styleUrls: ["./draw.component.scss"],
})
export class DrawComponent implements OnInit {
	map: Map;
	pointStyle = "Cross";
	pointSize = 10;

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

	componentVisibility: { [key: string]: boolean } = {
		drawPoint: false,
		drawLine: false,
		drawFreeLine: false,
		drawPolygon: false,
		drawFreePolygon: false,
		drawCircle: false,
	};
	resetComponentVisibility() {
		for (const key in this.componentVisibility) {
			this.componentVisibility[key] = false;
		}
	}

	drawPoint() {
		this.resetComponentVisibility();
		this.componentVisibility = {
			...this.componentVisibility,
			drawPoint: true,
		};
		const draw = this.drawService.initializePoint(this.map);
		draw.on("drawend", (event) => {
			this.drawnFeatures.push(event.feature);
			event.feature.setStyle(this.drawService.getPointStyle(this.pointStyle));
		});
	}

	drawCircle() {
		const drawCicle = this.drawService.initializeCircle(this.map);
		this.map.addInteraction(drawCicle);
	}

	drawLine() {
		const drawLineString = this.drawService.initializeLineString(this.map);
		this.map.addInteraction(drawLineString);
	}

	drawPolygon() {
		const drawPolygon = this.drawService.initializePolygon(this.map);
		this.map.addInteraction(drawPolygon);
	}

	drawFreeLine() {
		const drawFreeLine = this.drawService.initalizeFreeLineString(this.map);
		this.map.addInteraction(drawFreeLine);
	}

	drawFreePolygon() {
		const drawFreePolygon = this.drawService.initalizeFreePolygon(this.map);
		this.map.addInteraction(drawFreePolygon);
	}
	updatePointStyle(style: string) {
		this.pointStyle = style;
	}
	updateSize(size: number) {
		this.pointSize = size;
		this.drawService.setSize(size);
	}
}
