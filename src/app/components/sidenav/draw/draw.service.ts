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
import { createBox, createRegularPolygon } from "ol/interaction/Draw.js";
import ImageStyle from "ol/style/Image";
import { Subject } from "rxjs";
import { GeometryFunction } from "ol/style/Style";

@Injectable({
	providedIn: "root",
})
export class DrawService {
	private pointSize = 10;
	private pointStyle: string | undefined;
	private pointColor = "rgba(0, 255, 0, 1)";

	private lineStyle: string | undefined;
	private lineSize = 2;
	private lineColor = "rgba(255, 0, 0, 1)";
	private lineDash: Array<number> | undefined;

	private freeLineStyle: string | undefined;
	private freeLineSize: number;
	private freeLineColor = "rgba(255, 0, 0, 1)";

	private polygonSize = 10;
	private polygonStrokeColor = "rgba(0, 0, 255, 1)";
	private polygonFillColor = "rgba(255, 0, 0, 1)";
	private polygonColor = this.polygonFillColor + this.polygonStrokeColor;
	private polygonFillStyle: CanvasPattern | null | undefined;
	private polygonStrokeStyle: string | undefined;
	private polygonPattern: string;

	private freePolygonSize = 10;
	private freePolygonStrokeColor = "rgba(0, 0, 255, 1)";
	private freePolygonFillColor = "rgba(255, 0, 0, 1)";
	private freePolygonColor =
		this.freePolygonFillColor + this.freePolygonStrokeColor;
	private freePolygonFillStyle: CanvasPattern | null | undefined;
	private freePolygonStrokeStyle: string | undefined;
	private freePolygonPattern: string;

	private figureSize = 10;
	private figureStrokeColor = "rgba(0, 0, 255, 1)";
	private figureFillColor = "rgba(255, 0, 0, 1)";
	private figureColor = this.figureFillColor + this.figureStrokeColor;
	private figureFillStyle: CanvasPattern | null | undefined;
	private figureStrokeStyle: string | undefined;
	private figurePattern: string;

	colorChanged = new Subject<string>();

	replaceAlpha(rgbaString: string, newAlpha: string) {
		return rgbaString.replace(
			/(rgba\(\d+,\s*\d+,\s*\d+,\s*)\d*\.?\d+(\))/,
			`$1${newAlpha}$2`,
		);
	}

	initializeDraw(
		map: Map,
		vector: VectorLayer<VectorSource>,
		source: VectorSource,
		type: Type,
		freehand?: boolean,
		geometryFunction?: any
	) {
		map.addLayer(vector);
		const draw = new Draw({
			source: source,
			type: type,
			freehand: freehand,
			geometryFunction: geometryFunction,
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
		draw.on("drawend", async (event) => {
			event.feature.setStyle(await this.getStyle("drawPoint"));
		});
		return draw;
	}

	initializeLine(map: Map) {
		const source = new VectorSource();
		const vector = this.initalizeLayer(source);
		const draw = this.initializeDraw(map, vector, source, "LineString");
		draw.on("drawstart", async (event) => {
			event.feature.setStyle(await this.getStyle("drawLine"));
		});
		return draw;
	}

	initalizeFreeLine(map: Map) {
		const source = new VectorSource();
		const vector = this.initalizeLayer(source);
		const draw = this.initializeDraw(map, vector, source, "LineString", true);
		draw.on("drawstart", async (event) => {
			event.feature.setStyle(await this.getStyle("drawFreeLine"));
		});
		return draw;
	}

	async stylePatternSimplePoly(
		pattern: string,
		fillColor: string | undefined,
	): Promise<CanvasPattern | null> {
		return new Promise((resolve, reject) => {
			const vectorImage = new Image();
			vectorImage.crossOrigin = "anonymous";
			vectorImage.src = "../../../assets/images/" + pattern;
			this.polygonPattern = pattern;
			this.freePolygonPattern = pattern;

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
				ctx.globalCompositeOperation = "source-in";
				if (fillColor) {
					ctx.fillStyle = fillColor;
					ctx.fillRect(0, 0, canvas.width, canvas.height);
				}

				const createdPattern = ctx.createPattern(canvas, "repeat");
				resolve(createdPattern);
			};
			vectorImage.onerror = () => {
				resolve(null);
			};
		});
	}
	initializePolygon(map: Map) {
		const source = new VectorSource();
		const vector = this.initalizeLayer(source);
		const draw = this.initializeDraw(map, vector, source, "Polygon");
		draw.on("drawstart", async (event) => {
			event.feature.setStyle(await this.getStyle("drawPolygon"));
		});
		return draw;
	}
	initalizeFreePolygon(map: Map) {
		const source = new VectorSource();
		const vector = this.initalizeLayer(source);
		const draw = this.initializeDraw(map, vector, source, "Polygon", true);
		draw.on("drawstart", async (event) => {
			event.feature.setStyle(await this.getStyle("drawFreePolygon"));
		});
		return draw;
	}

	initializeFigure(map: Map) {
		const source = new VectorSource();
		const vector = this.initalizeLayer(source);
		const draw = this.initializeDraw(map, vector, source, "Circle",false, createBox());
		draw.on("drawstart", async (event) => {
			event.feature.setStyle(await this.getStyle("drawFigure"));
		});
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
				break;
			case "drawFreeLine":
				this.freeLineSize = size;
				break;
			case "drawFreePolygon":
				this.freePolygonSize = size;
				break;
			case "drawFigurePolygon":
				this.figureSize = size;
				break;
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
			case "drawFreeLine":
				return this.freeLineSize;
			case "drawFreePolygon":
				return this.freePolygonSize;
			case "drawFigure":
				return this.figureSize;
		}
	}

	setColor(color: string, tool: string, type?: string) {
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
				if (type == "polygon") {
					const oldFillColor = this.polygonFillColor;
					this.polygonFillColor = this.replaceAlpha(oldFillColor, color);

					const oldStrokeColor = this.polygonStrokeColor;
					this.polygonStrokeColor = this.replaceAlpha(oldStrokeColor, color);
				}
				if (type == "fill") {
					this.polygonFillColor = color;
					this.colorChanged.next(color);
				}

				if (type == "stroke") {
					this.polygonStrokeColor = color;
					this.colorChanged.next(color);
				}
				this.polygonColor = this.polygonFillColor + this.polygonStrokeColor;
				break;

			case "drawFreeLine":
				this.freeLineColor = color;
				this.colorChanged.next(color);
				break;
			case "drawFreePolygon":
				if (type == "polygon") {
					const oldFillColor = this.freePolygonFillColor;
					this.freePolygonFillColor = this.replaceAlpha(oldFillColor, color);

					const oldStrokeColor = this.freePolygonStrokeColor;
					this.freePolygonStrokeColor = this.replaceAlpha(
						oldStrokeColor,
						color,
					);
				}
				if (type == "fill") {
					this.freePolygonFillColor = color;
					this.colorChanged.next(color);
				}

				if (type == "stroke") {
					this.freePolygonStrokeColor = color;
					this.colorChanged.next(color);
				}
				this.freePolygonColor =
					this.freePolygonFillColor + this.freePolygonStrokeColor;
				break;
			case "drawFigure":
				if (type == "polygon") {
					const oldFillColor = this.figureFillColor;
					this.figureFillColor = this.replaceAlpha(oldFillColor, color);

					const oldStrokeColor = this.figureStrokeColor;
					this.figureStrokeColor = this.replaceAlpha(oldStrokeColor, color);
				}
				if (type == "fill") {
					this.figureFillColor = color;
					this.colorChanged.next(color);
				}

				if (type == "stroke") {
					this.figureStrokeColor = color;
					this.colorChanged.next(color);
				}
				this.figureColor = this.figureFillColor + this.figureStrokeColor;
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
			case "drawFreeLine":
				return this.freeLineColor;
			case "drawFreePolygon":
				return this.freePolygonColor;
			case "drawFigure":
				return this.figureColor;
		}
	}

	setStyle(tool: string, style: string) {
		switch (tool) {
			case "drawPoint":
				this.pointStyle = style;
				break;
			case "drawLine":
				this.lineStyle = style;
				break;
			case "drawPolygon":
				this.polygonStrokeStyle = style;
				break;
			case "drawFreeLine":
				this.freeLineStyle = style;
				break;
			case "drawFreePolygon":
				this.freePolygonStrokeStyle = style;
				break;
			case "drawFigure":
				this.figureStrokeStyle = style;
				break;
		}
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

	getPolygonFill() {
		return this.stylePatternSimplePoly(
			this.polygonPattern,
			this.polygonFillColor,
		);
	}

	async setFreePolygonFill(style: string) {
		switch (style) {
			case "VerticalHatching":
				this.freePolygonFillStyle = await this.stylePatternSimplePoly(
					"vertical.png",
					this.freePolygonFillColor,
				);
				console.log(this.freePolygonFillStyle);
				break;
			case "HorizontalHatching":
				this.freePolygonFillStyle = await this.stylePatternSimplePoly(
					"horizontal.png",
					this.freePolygonFillColor,
				);
				break;
			case "CrossHatching":
				this.freePolygonFillStyle = await this.stylePatternSimplePoly(
					"square.png",
					this.freePolygonFillColor,
				);
				break;
			case "DiagonalHatching":
				this.freePolygonFillStyle = await this.stylePatternSimplePoly(
					"diagonal.png",
					this.freePolygonFillColor,
				);
				break;
			case "ReverseDiagonalHatching":
				this.freePolygonFillStyle = await this.stylePatternSimplePoly(
					"reverseDiagonal.png",
					this.freePolygonFillColor,
				);
				break;
			case "DiagonalCrossHatching":
				this.freePolygonFillStyle = await this.stylePatternSimplePoly(
					"cross.png",
					this.freePolygonFillColor,
				);
				break;
		}
	}
	getFreePolygonFill() {
		return this.stylePatternSimplePoly(
			this.freePolygonPattern,
			this.freePolygonFillColor,
		);
	}

	async setFigureFill(style: string) {
		switch (style) {
			case "VerticalHatching":
				this.figureFillStyle = await this.stylePatternSimplePoly(
					"vertical.png",
					this.figureFillColor,
				);
				break;
			case "HorizontalHatching":
				this.figureFillStyle = await this.stylePatternSimplePoly(
					"horizontal.png",
					this.figureFillColor,
				);
				break;
			case "CrossHatching":
				this.figureFillStyle = await this.stylePatternSimplePoly(
					"square.png",
					this.figureFillColor,
				);
				break;
			case "DiagonalHatching":
				this.figureFillStyle = await this.stylePatternSimplePoly(
					"diagonal.png",
					this.figureFillColor,
				);
				break;
			case "ReverseDiagonalHatching":
				this.figureFillStyle = await this.stylePatternSimplePoly(
					"reverseDiagonal.png",
					this.figureFillColor,
				);
				break;
			case "DiagonalCrossHatching":
				this.figureFillStyle = await this.stylePatternSimplePoly(
					"cross.png",
					this.figureFillColor,
				);
				break;
		}
	}

	getFigureFill() {
		return this.stylePatternSimplePoly(
			this.figurePattern,
			this.figureFillColor,
		);
	}

	async getStyle(tool: string): Promise<Style | undefined> {
		let size: number | undefined;
		let color;
		let options: { stroke?: Stroke; fill?: Fill; image?: ImageStyle } = {};
		let fillColor: string;
		let strokeColor: string;
		switch (tool) {
			case "drawPoint":
				size = this.getSize(tool);
				color = this.getColor(tool);
				options = {
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
				};
				switch (this.pointStyle) {
					case "Cross":
						options.image = new RegularShape({
							stroke: new Stroke({
								color: color,
								width: 2,
							}),
							points: 4,
							radius: size!,
							radius2: 0,
							angle: 0,
						});
						break;
					case "Diamond":
						options.image = new RegularShape({
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
						});
						break;
					case "Cancel":
						options.image = new RegularShape({
							stroke: new Stroke({
								color: color,
								width: 2,
							}),
							points: 4,
							radius: size!,
							radius2: 0,
							angle: Math.PI / 4,
						});
						break;
					case "Square":
						options.image = new RegularShape({
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
						});
						break;
					case "Circle":
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
				return new Style(options);
			case "drawLine":
				size = this.getSize(tool);
				color = this.getColor(tool);
				options = {
					stroke: new Stroke({
						color: color,
						width: size,
					}),
				};
				switch (this.lineStyle) {
					case "Dashed":
						options.stroke = new Stroke({
							color: color,
							width: size,
							lineDash: [16, 8],
						});
						break;
					case "DashDot":
						options.stroke = new Stroke({
							color: color,
							width: size,
							lineDash: [16, 16, 0, 16],
						});
						break;
					case "Dotted":
						options.stroke = new Stroke({
							color: color,
							width: size,
							lineDash: [0, 8],
						});
						break;
					case "DashDotDot":
						options.stroke = new Stroke({
							color: color,
							width: size,
							lineDash: [16, 16, 0, 16, 0, 16],
						});
						break;
					case "Solid":
						options.stroke = new Stroke({
							color: color,
							width: size,
						});
				}

				return new Style(options);
			case "drawPolygon":
				size = this.getSize(tool);

				fillColor = this.polygonFillColor;

				strokeColor = this.polygonStrokeColor;
				this.polygonFillStyle = await this.getPolygonFill();

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
				if (!this.polygonFillStyle) {
					options.fill = new Fill({
						color: this.polygonFillColor,
					});
				}
				this.polygonColor = fillColor + strokeColor;
				return new Style(options);
			case "drawFreeLine":
				size = this.getSize(tool);
				console.log(size);
				color = this.getColor(tool);
				options = {
					stroke: new Stroke({
						color: color,
						width: size,
					}),
				};
				switch (this.freeLineStyle) {
					case "Dashed":
						options.stroke = new Stroke({
							color: color,
							width: size,
							lineDash: [16, 8],
						});
						break;
					case "DashDot":
						options.stroke = new Stroke({
							color: color,
							width: size,
							lineDash: [16, 16, 0, 16],
						});
						break;
					case "Dotted":
						options.stroke = new Stroke({
							color: color,
							width: size,
							lineDash: [0, 8],
						});
						break;
					case "DashDotDot":
						options.stroke = new Stroke({
							color: color,
							width: size,
							lineDash: [16, 16, 0, 16, 0, 16],
						});
						break;
					case "Solid":
						options.stroke = new Stroke({
							color: color,
							width: size,
						});
				}

				return new Style(options);
			case "drawFreePolygon":
				size = this.getSize(tool);

				fillColor = this.freePolygonFillColor;

				console.log(fillColor, this.freePolygonFillStyle);

				strokeColor = this.freePolygonStrokeColor;
				this.freePolygonFillStyle = await this.getFreePolygonFill();

				options = {
					stroke: new Stroke({
						color: strokeColor,
						width: size,
						lineDash: this.lineDash,
					}),
					fill: new Fill({
						color: this.freePolygonFillStyle,
					}),
				};

				switch (this.freePolygonStrokeStyle) {
					case "Dashed":
						options.stroke = new Stroke({
							color: strokeColor,
							width: size,
							lineDash: [16, 8],
						});

						this.lineDash = [16, 8];

						options.fill = new Fill({
							color: this.freePolygonFillStyle,
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
							color: this.freePolygonFillStyle,
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
							color: this.freePolygonFillStyle,
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
							color: this.freePolygonFillStyle,
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
				if (!this.freePolygonFillStyle) {
					options.fill = new Fill({
						color: this.freePolygonFillColor,
					});
				}

				this.freePolygonColor = fillColor + strokeColor;
				return new Style(options);
			case "drawFigure":
				size = this.getSize(tool);

				fillColor = this.figureFillColor;

				console.log(fillColor, this.figureFillStyle);

				strokeColor = this.figureStrokeColor;
				this.figureFillStyle = await this.getFigureFill();

				options = {
					stroke: new Stroke({
						color: strokeColor,
						width: size,
						lineDash: this.lineDash,
					}),
					fill: new Fill({
						color: this.figureFillStyle,
					}),
				};

				switch (this.figureStrokeStyle) {
					case "Dashed":
						options.stroke = new Stroke({
							color: strokeColor,
							width: size,
							lineDash: [16, 8],
						});

						this.lineDash = [16, 8];

						options.fill = new Fill({
							color: this.figureFillStyle,
						});
						options.image = new RegularShape({
							points: 3,
							radius: 10,
							rotation: 0,
							angle: 0,
							stroke: options.stroke,
							fill: options.fill,
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
							color: this.figureFillStyle,
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
							color: this.figureFillStyle,
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
							color: this.figureFillStyle,
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
				if (!this.figureFillStyle) {
					options.fill = new Fill({
						color: this.figureFillColor,
					});
				}
				console.log(options);
				this.figureColor = fillColor + strokeColor;
				return new Style(options);
		}
	}
}
