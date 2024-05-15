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
		"drawFigure",
	];
	pointSize = 10;
	pointColor: string;

	lineSize = 2;
	lineColor: string;

	freeLineSize = 2;
	freeLineColor: string;

	polygonSize = 10;
	polygonFillColor: string;
	polygonStrokeColor: string;

	freePolygonSize = 10;
	freePolygonFillColor: string;
	freePolygonStrokeColor: string;

	figureSize = 10;
	figureFillColor: string;
	figureStrokeColor: string;

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
		drawFigure: false,
	};

	updateSize(size: number, tool: string) {
		this.drawService.setSize(size, tool);
	}

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
		this.drawService.removeGlobalInteraction(this.map, this.activeInteraction);
		const drawPoint = this.drawService.initializePoint(this.map);
		this.activeInteraction = drawPoint;
		this.drawService.addGlobalInteraction(this.map, drawPoint);
	}

	drawLine() {
		this.resetComponentVisibility();
		this.componentVisibility = {
			...this.componentVisibility,
			drawLine: true,
		};
		this.drawService.removeGlobalInteraction(this.map, this.activeInteraction);
		const drawLine = this.drawService.initializeLine(this.map);
		this.activeInteraction = drawLine;
		this.drawService.addGlobalInteraction(this.map, drawLine);
	}

	drawPolygon() {
		this.resetComponentVisibility();
		this.componentVisibility = {
			...this.componentVisibility,
			drawPolygon: true,
		};
		this.drawService.removeGlobalInteraction(this.map, this.activeInteraction);
		const drawPolygon = this.drawService.initializePolygon(this.map);
		this.activeInteraction = drawPolygon;
		this.drawService.addGlobalInteraction(this.map, drawPolygon);
	}

	drawFreeLine() {
		this.resetComponentVisibility();
		this.componentVisibility = {
			...this.componentVisibility,
			drawFreeLine: true,
		};
		this.drawService.removeGlobalInteraction(this.map, this.activeInteraction);
		const drawFreeLine = this.drawService.initalizeFreeLine(this.map);
		this.activeInteraction = drawFreeLine;
		this.drawService.addGlobalInteraction(this.map, drawFreeLine);
	}

	drawFreePolygon() {
		this.resetComponentVisibility();
		this.componentVisibility = {
			...this.componentVisibility,
			drawFreePolygon: true,
		};
		this.drawService.removeGlobalInteraction(this.map, this.activeInteraction);
		const drawFreePolygon = this.drawService.initalizeFreePolygon(this.map);
		this.activeInteraction = drawFreePolygon;
		this.drawService.addGlobalInteraction(this.map, drawFreePolygon);
	}

	drawFigure() {
		this.resetComponentVisibility();
		this.componentVisibility = {
			...this.componentVisibility,
			drawFigure: true,
		};
		this.drawService.removeGlobalInteraction(this.map, this.activeInteraction);
		const drawFigure = this.drawService.initializeFigure(this.map, "Circle");
		this.activeInteraction = drawFigure;
		this.drawService.addGlobalInteraction(this.map, drawFigure);
	}
}
