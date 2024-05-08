import { Injectable } from "@angular/core";
import { Type } from "ol/geom/Geometry";
import { Draw } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import VectorSource from "ol/source/Vector";
import { Style, RegularShape, Stroke, Fill } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { Subject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class DrawService {
	private lineStyle = "Solid";
	private lineSize = 2;
	private pointSize = 10;
	private pointStyle = "Cross";

	private pointColor = "rgba(0, 255, 0, 1)";
	private lineColor = "rgba(255, 0, 0, 1)";
	private color = "rgba(255, 0, 0, 1)";
	colorChanged = new Subject<string>();

	setPointSize(size: number) {
		this.pointSize = size;
	}

	setColor(color: string, tool: string) {
		console.log(color);
		switch (tool) {
			case "drawPoint":
				this.pointColor = color;
				this.colorChanged.next(color);
				break;
			case "drawLine":
				this.lineColor = color;
	
				this.colorChanged.next(color);
		}
	}

	getColor() {
		return this.color;
	}

	getPointSize(): number {
		return this.pointSize;
	}

	setLineSize(size: number) {
		this.lineSize = size;
	}

	getLineSize(): number {
		return this.lineSize;
	}

	setPointColor(color: string) {
		this.pointColor = color;
		this.colorChanged.next(color);
	}

	getPointColor(): string {
		return this.pointColor;
	}

	setLineColor(color: string) {
		this.lineColor = color;
		this.colorChanged.next(color);
	}

	getLineColor(): string {
		return this.lineColor;
	}

	initializeDraw(
		map: Map,
		vector: VectorLayer<VectorSource>,
		source: VectorSource,
		type: Type,
		freehand?: boolean,
	) {
		map.addLayer(vector);
		const draw = new Draw({
			source: source,
			type: type,
			freehand: freehand,
		});
		map.addInteraction(draw);
		return draw;
	}

	initalizeLayer(source: VectorSource) {
		const vector = new VectorLayer({
			source: source,
		});
		return vector;
	}

	initializePoint(map: Map) {
		const source = new VectorSource();
		const vector = this.initalizeLayer(source);
		const draw = this.initializeDraw(map, vector, source, "Point");
		draw.on("drawend", (event) => {
			event.feature.setStyle(this.getPointStyle());
		});
		return draw;
	}

	initializeCircle(map: Map) {
		const source = new VectorSource();
		const vector = this.initalizeLayer(source);
		const draw = this.initializeDraw(map, vector, source, "Circle");
		return draw;
	}

	initializeLine(map: Map) {
		const source = new VectorSource();
		const vector = this.initalizeLayer(source);
		const draw = this.initializeDraw(map, vector, source, "LineString");
		draw.on("drawstart", (event) => {
			event.feature.setStyle(this.getLineStyle());
		});
		return draw;
	}

	initializePolygon(map: Map) {
		const source = new VectorSource();
		const vector = this.initalizeLayer(source);
		const draw = this.initializeDraw(map, vector, source, "Polygon");
		return draw;
	}

	initalizeFreeLine(map: Map) {
		const source = new VectorSource();
		const vector = this.initalizeLayer(source);
		const draw = this.initializeDraw(map, vector, source, "LineString", true);
		draw.on("drawstart", (event) => {
			event.feature.setStyle(this.getLineStyle());
		});
		return draw;
	}
	initalizeFreePolygon(map: Map) {
		const source = new VectorSource();
		const vector = this.initalizeLayer(source);
		const draw = this.initializeDraw(map, vector, source, "Polygon", true);
		return draw;
	}
	setPointStyle(style: string) {
		this.pointStyle = style;
	}
	getPointStyle() {
		const size = this.getPointSize();
		const color = this.getPointColor();
		switch (this.pointStyle) {
			case "Cross":
				return new Style({
					image: new RegularShape({
						stroke: new Stroke({
							color: color,
							width: 2,
						}),
						points: 4,
						radius: size,
						radius2: 0,
						angle: 0,
					}),
				});
			case "Diamond":
				return new Style({
					image: new RegularShape({
						fill: new Fill({
							color: color,
						}),
						stroke: new Stroke({
							color: color,
							width: 2,
						}),
						points: 4,
						radius: size,
						radius2: size * Math.sqrt(2),
						angle: Math.PI / 4,
					}),
				});
			case "Cancel":
				return new Style({
					image: new RegularShape({
						stroke: new Stroke({
							color: color,
							width: 2,
						}),
						points: 4,
						radius: size,
						radius2: 0,
						angle: Math.PI / 4,
					}),
				});
			case "Square":
				return new Style({
					image: new RegularShape({
						fill: new Fill({
							color: color,
						}),
						stroke: new Stroke({
							color: color,
							width: 2,
						}),
						points: 4,
						radius: size,
						angle: Math.PI / 4,
					}),
				});
			case "Circle":
			default:
				return new Style({
					image: new CircleStyle({
						radius: size,
						fill: new Fill({
							color: color,
						}),
						stroke: new Stroke({
							color: color,
							width: 2,
						}),
					}),
				});
		}
	}

	setLineStyle(style: string) {
		this.lineStyle = style;
	}
	getLineStyle() {
		const size = this.getLineSize();
		const color = this.getLineColor();
		switch (this.lineStyle) {
			case "Dashed":
				return new Style({
					stroke: new Stroke({
						color: color,
						width: size,
						lineDash: [16, 8],
					}),
				});
			case "DashDot":
				return new Style({
					stroke: new Stroke({
						color: color,
						width: size,
						lineDash: [16, 16, 0, 16],
					}),
				});
			case "Dotted":
				return new Style({
					stroke: new Stroke({
						color: color,
						width: size,
						lineDash: [0, 8],
					}),
				});
			case "DashDotDot":
				return new Style({
					stroke: new Stroke({
						color: color,
						width: size,
						lineDash: [16, 16, 0, 16, 0, 16],
					}),
				});
			case "Solid":
				return new Style({
					stroke: new Stroke({
						color: color,
						width: size,
					}),
				});
		}
	}
}
