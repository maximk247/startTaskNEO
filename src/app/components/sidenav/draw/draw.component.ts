import { Component, OnInit } from "@angular/core";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import VectorSource from "ol/source/Vector";
import { MapService } from "../../map/map.service";
import Feature from "ol/Feature";
import { DrawService } from "./draw.service";
import { Draw } from "ol/interaction";

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

	polygonSize = 10;
	polygonFillColor = "rgba(255,0,0,1)";
	polygonStrokeColor = "rgba(255,0,0,1)";

	vectorLayer: VectorLayer<VectorSource>;
	source: VectorSource;
	drawnFeatures: Array<Feature> = [];
	activeInteraction: Draw | null = null;

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

	removeActiveInteraction() {
		if (this.activeInteraction) {
			this.map.removeInteraction(this.activeInteraction);
			this.activeInteraction = null;
		}
	}

	drawPoint() {
		this.resetComponentVisibility();
		this.componentVisibility = {
			...this.componentVisibility,
			drawPoint: true,
		};
		this.removeActiveInteraction();
		const draw = this.drawService.initializePoint(this.map);
		this.activeInteraction = draw;
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
		this.removeActiveInteraction();
		const drawLine = this.drawService.initializeLine(this.map);
		this.activeInteraction = drawLine;
		this.map.addInteraction(drawLine);
	}

	drawPolygon() {
		this.resetComponentVisibility();
		this.componentVisibility = {
			...this.componentVisibility,
			drawPolygon: true,
		};
		this.removeActiveInteraction();
		const drawPolygon = this.drawService.initializePolygon(this.map);
		this.activeInteraction = drawPolygon;
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

	updateSize(size: number, tool: string) {
		this.drawService.setSize(size, tool);
	}
}
