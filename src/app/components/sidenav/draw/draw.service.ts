/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-case-declarations */
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
	private lineStyle: string | undefined;
	private lineSize = 2;
	private lineColor = "rgba(255, 0, 0, 1)";
	private lineDash: Array<number> | undefined;

	private pointSize = 10;
	private pointStyle: string | undefined;
	private pointColor = "rgba(0, 255, 0, 1)";

	private polygonSize = 10;
	private polygonColor = "rgba(255, 0, 0, 1)";
	private polygonStrokeColor = "rgba(0, 0, 255, 1)";
	private polygonFillColor: string | undefined;
	private polygonFillStyle: CanvasPattern | null | undefined;
	private polygonStrokeStyle: string | undefined;

	colorChanged = new Subject<string>();

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
			event.feature.setStyle(this.getStyle("drawPoint"));
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
			event.feature.setStyle(this.getStyle("drawLine"));
		});
		return draw;
	}

	async stylePatternSimplePoly(
		pattern: string,
		fillColor: string | undefined,
	): Promise<CanvasPattern | null> {
		return new Promise((resolve, reject) => {
			const vectorImage = new Image();
			vectorImage.crossOrigin = "anonymous"; // Enable CORS for the image
			vectorImage.src = "../../../assets/images/" + pattern;
			vectorImage.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					reject("Could not create canvas context");
					return;
				}
				canvas.width = vectorImage.width;
				canvas.height = vectorImage.height;
				ctx.drawImage(vectorImage, 0, 0);
				console.log(fillColor);
				ctx.globalCompositeOperation = "source-in";
				if (fillColor) {
					ctx.fillStyle = fillColor;
					ctx.fillRect(0, 0, canvas.width, canvas.height);
				}

				const createdPattern = ctx.createPattern(canvas, "repeat");
				resolve(createdPattern);
			};
			vectorImage.onerror = (error) => {
				console.error("Error loading image:", error);
				resolve(null);
			};
		});
	}
	initializePolygon(map: Map) {
		const source = new VectorSource();
		const vector = this.initalizeLayer(source);
		const draw = this.initializeDraw(map, vector, source, "Polygon");
		draw.on("drawstart", async (event) => {
			event.feature.setStyle(this.getStyle("drawPolygon"));
		});
		return draw;
	}

	initalizeFreeLine(map: Map) {
		const source = new VectorSource();
		const vector = this.initalizeLayer(source);
		const draw = this.initializeDraw(map, vector, source, "LineString", true);
		draw.on("drawstart", (event) => {
			event.feature.setStyle(this.getStyle("drawLine"));
		});
		return draw;
	}
	initalizeFreePolygon(map: Map) {
		const source = new VectorSource();
		const vector = this.initalizeLayer(source);
		const draw = this.initializeDraw(map, vector, source, "Polygon", true);
		return draw;
	}

	setSize(size: number, tool: string) {
		switch (tool) {
			case "drawPoint":
				this.pointSize = size;
				break;
			case "drawLine":
				this.lineSize = size;
				break;
			case "drawPolygon":
				this.polygonSize = size;
		}
	}

	getSize(tool: string): number | undefined {
		switch (tool) {
			case "drawPoint":
				return this.pointSize;
			case "drawLine":
				return this.lineSize;
			case "drawPolygon":
				return this.polygonSize;
		}
	}

	setColor(color: string, tool: string, type?: string, fillColor?: string) {
		switch (tool) {
			case "drawPoint":
				this.pointColor = color;
				this.colorChanged.next(color);
				break;
			case "drawLine":
				this.lineColor = color;
				this.colorChanged.next(color);
				break;
			case "drawPolygon":
				if (type == "fill") {
					console.log(fillColor);
					this.polygonFillColor = fillColor;
					this.colorChanged.next(color);
				}

				if (type == "stroke") {
					this.polygonStrokeColor = color;
					this.colorChanged.next(color);
				}

				break;
		}
	}

	getColor(tool: string): string | undefined {
		switch (tool) {
			case "drawPoint":
				return this.pointColor;
			case "drawLine":
				return this.lineColor;
			case "drawPolygon":
				return this.polygonColor;
		}
	}

	setStyle(tool: string, style: string, createdPattern?: CanvasPattern | null) {
		switch (tool) {
			case "drawPoint":
				this.pointStyle = style;
				break;
			case "drawLine":
				this.lineStyle = style;
				break;
			case "drawPolygon":
				this.polygonStrokeStyle = style;
				this.polygonFillStyle = createdPattern;
				break;
		}
	}

	getPolygonFill() {
		return this.polygonFillStyle;
	}

	async setPolygonFill(style: string) {
		switch (style) {
			case "VerticalHatching":
				this.polygonFillStyle = await this.stylePatternSimplePoly(
					"vertical.png",
					this.polygonFillColor,
				);
				break;
			case "HorizontalHatching":
				this.polygonFillStyle = await this.stylePatternSimplePoly(
					"horizontal.png",
					this.polygonFillColor,
				);
				break;
			case "CrossHatching":
				this.polygonFillStyle = await this.stylePatternSimplePoly(
					"square.png",
					this.polygonFillColor,
				);
				break;
			case "DiagonalHatching":
				this.polygonFillStyle = await this.stylePatternSimplePoly(
					"diagonal.png",
					this.polygonFillColor,
				);
				break;
			case "ReverseDiagonalHatching":
				this.polygonFillStyle = await this.stylePatternSimplePoly(
					"reverseDiagonal.png",
					this.polygonFillColor,
				);
				break;
			case "DiagonalCrossHatching":
				this.polygonFillStyle = await this.stylePatternSimplePoly(
					"cross.png",
					this.polygonFillColor,
				);
				break;
		}
	}

	getStyle(tool: string): Style | undefined {
		let size: number | undefined;
		let color;
		let options: { stroke?: Stroke; fill?: Fill } = {};
		switch (tool) {
			case "drawPoint":
				size = this.getSize(tool);
				color = this.getColor(tool);
				switch (this.pointStyle) {
					case "Cross":
						return new Style({
							image: new RegularShape({
								stroke: new Stroke({
									color: color,
									width: 2,
								}),
								points: 4,
								radius: size!,
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
								radius2: size! * Math.sqrt(2),
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
								radius: size!,
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
								radius: size!,
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
			case "drawLine":
				size = this.getSize(tool);
				color = this.getColor(tool);
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
				break;
			case "drawPolygon":
				size = this.getSize(tool);

				const fillColor = this.polygonFillColor;

				const strokeColor = this.polygonStrokeColor;

				options = {
					stroke: new Stroke({
						color: strokeColor,
						width: size,
						lineDash: this.lineDash,
					}),
					fill: new Fill({
						color: this.polygonFillStyle,
					}),
				};
				switch (this.polygonStrokeStyle) {
					case "Dashed":
						options.stroke = new Stroke({
							color: strokeColor,
							width: size,
							lineDash: [16, 8],
						});

						this.lineDash = [16, 8];

						options.fill = new Fill({
							color: this.polygonFillStyle,
						});

						break;

					case "DashDot":
						options.stroke = new Stroke({
							color: strokeColor,
							width: size,
							lineDash: [16, 16, 0, 16],
						});
						this.lineDash = [16, 16, 0, 16];
						options.fill = new Fill({
							color: this.polygonFillStyle,
						});
						break;
					case "Dotted":
						options.stroke = new Stroke({
							color: strokeColor,
							width: size,
							lineDash: [0, 8],
						});
						this.lineDash = [0, 8];
						options.fill = new Fill({
							color: this.polygonFillStyle,
						});
						break;
					case "DashDotDot":
						options.stroke = new Stroke({
							color: strokeColor,
							width: size,
							lineDash: [16, 16, 0, 16, 0, 16],
						});
						this.lineDash = [16, 16, 0, 16, 0, 16];
						options.fill = new Fill({
							color: this.polygonFillStyle,
						});
						break;
					case "Solid":
						options.stroke = new Stroke({
							color: strokeColor,
							width: size,
						});
						options.fill = new Fill({
							color: fillColor,
						});
						this.lineDash = undefined;
				}

				return new Style(options);
		}
	}
}
