import { Component, OnInit } from "@angular/core";
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
	private map: Map;
	tools = [
		"drawPoint",
		"drawLine",
		"drawFreeLine",
		"drawPolygon",
		"drawFreePolygon",
		"drawCircle",
	];
	pointSize = 10;
	pointColor = "rgba(255,0,0,1)";
	lineSize = 2;
	lineColor = "rgba(255,0,0,1)";

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
		this.map.addInteraction(draw);
	}

	drawCircle() {
		const drawCircle = this.drawService.initializeCircle(this.map);
		this.map.addInteraction(drawCircle);
	}

	drawLine() {
		this.resetComponentVisibility();
		this.componentVisibility = {
			...this.componentVisibility,
			drawLine: true,
		};
		const drawLine = this.drawService.initializeLine(this.map);
		this.map.addInteraction(drawLine);
	}

	drawPolygon() {
		const drawPolygon = this.drawService.initializePolygon(this.map);
		this.map.addInteraction(drawPolygon);
	}

	drawFreeLine() {
		const drawFreeLine = this.drawService.initalizeFreeLine(this.map);
		this.map.addInteraction(drawFreeLine);
	}

	drawFreePolygon() {
		const drawFreePolygon = this.drawService.initalizeFreePolygon(this.map);
		this.map.addInteraction(drawFreePolygon);
	}

	updatePointSize(size: number) {
		this.drawService.setPointSize(size);
	}
	updateLineSize(size: number) {
		this.drawService.setLineSize(size);
	}
}
