/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-case-declarations */
import { Injectable } from "@angular/core";
import Geometry, { Type } from "ol/geom/Geometry";
import { Draw, Interaction } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import VectorSource from "ol/source/Vector";
import { Style, RegularShape, Stroke, Fill } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { GeometryFunction } from "ol/interaction/Draw.js";
import { Subject } from "rxjs";
import {
	DrawToolKey,
	fillColor,
	DrawOptions,
	DrawPoint,
	DrawLine,
	DrawPolygon,
	DrawFigure,
} from "./interfaces/draw.interface";
import { Feature } from "ol";

@Injectable({
	providedIn: "root",
})
export class DrawService {
	private point: DrawPoint = {
		size: 10,
		style: "Circle",
		color: "rgba(0, 255, 0, 1)",
	};

	private line: DrawLine = {
		size: 2,
		style: "Solid",
		color: "rgba(255, 0, 0, 1)",
		dash: [5, 5],
	};

	private freeLine: DrawLine = {
		size: 2,
		style: "Solid",
		color: "rgba(255, 0, 0, 1)",
		dash: [5, 5],
	};

	private polygon: DrawPolygon = {
		size: 10,
		fillStyle: null,
		strokeStyle: null,
		color: "rgba(0, 0, 255, 1)",
		fillColor: "rgba(255, 0, 0, 1)",
		strokeColor: "rgba(0, 0, 255, 1)",
		pattern: "none",
		dash: [5, 5],
	};

	private freePolygon: DrawPolygon = {
		size: 10,
		fillStyle: null,
		strokeStyle: null,
		color: "rgba(0, 0, 255, 1)",
		fillColor: "rgba(255, 0, 0, 1)",
		strokeColor: "rgba(0, 0, 255, 1)",
		pattern: "none",
		dash: [5, 5],
	};

	private figure: DrawFigure = {
		size: 10,
		fillStyle: null,
		strokeStyle: null,
		color: "rgba(0, 0, 255, 1)",
		fillColor: "rgba(255, 0, 0, 1)",
		strokeColor: "rgba(0, 0, 255, 1)",
		pattern: "none",
		dash: [5, 5],
	};

	private vectorLayer: VectorLayer<VectorSource>;
	private vectorSource: VectorSource;
	private lastClickedFeature: Feature | null = null;

	colorChanged = new Subject<string>();
	

	removeAllDrawings(map: Map) {
		map.getLayers().forEach((layer) => {
			if (layer instanceof VectorLayer) {
				const source = layer.getSource();
				if (source instanceof VectorSource) {
					source.clear();
				}
			}
		});
	}

	removeDrawingOnMouseClick(map: Map, vectorLayer: VectorLayer<VectorSource>) {
		map.on("click", (event) => {
			const pixel = event.pixel;
			const features = map.getFeaturesAtPixel(pixel, {
				hitTolerance: 5,
				layerFilter: (layer) => layer === vectorLayer,
			}) as Array<Feature<Geometry>> | undefined;

			const clickedFeature =
				features?.find((feature) => feature instanceof Feature) || null;

			if (clickedFeature) {
				const source = vectorLayer.getSource();
				if (source instanceof VectorSource) {
					source.removeFeature(clickedFeature);
				}
			}
		});
	}
	setLastClickedFeature(feature: Feature) {
		this.lastClickedFeature = feature;
	}

	getLastClickedFeature(): Feature | null {
		return this.lastClickedFeature;
	}
	async stylePatternSimplePoly(
		pattern: string,
		fillColor: fillColor,
	): Promise<CanvasPattern | null> {
		return new Promise((resolve, reject) => {
			const vectorImage = new Image();
			vectorImage.crossOrigin = "anonymous";
			vectorImage.src = "../../../assets/images/" + pattern;
			this.polygon.pattern = pattern;
			this.freePolygon.pattern = pattern;
			this.figure.pattern = pattern;

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

	replaceAlpha(rgbaString: string, newAlpha: string) {
		return rgbaString.replace(
			/(rgba\(\d+,\s*\d+,\s*\d+,\s*)\d*\.?\d+(\))/,
			`$1${newAlpha}$2`,
		);
	}

	removeGlobalInteraction(map: Map, interaction: Interaction | null = null) {
		if (interaction) {
			map.removeInteraction(interaction);
			interaction = null;
		}
	}

	addGlobalInteraction(map: Map, interaction: Interaction) {
		map.addInteraction(interaction);
	}

	initializeDraw(
		map: Map,
		vector: VectorLayer<VectorSource>,
		source: VectorSource,
		type: Type,
		freehand?: boolean,
		geometryFunction?: GeometryFunction | undefined,
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

	initalizeLayer() {
		this.vectorSource = new VectorSource();
		this.vectorLayer = new VectorLayer({
			source: this.vectorSource,
		});
	}

	getVectorLayer() {
		return this.vectorLayer;
	}

	getVectorSource() {
		return this.vectorSource;
	}

	initializePoint(map: Map) {
		this.initalizeLayer();
		const draw = this.initializeDraw(
			map,
			this.vectorLayer,
			this.vectorSource,
			"Point",
		);
		draw.set("drawType", "point");
		draw.on("drawend", async (event) => {
			event.feature.setStyle(await this.getStyle("drawPoint"));
		});
		return draw;
	}

	initializeLine(map: Map) {
		this.initalizeLayer();
		const draw = this.initializeDraw(
			map,
			this.vectorLayer,
			this.vectorSource,
			"LineString",
		);
		draw.set("drawType", "line");
		draw.on("drawstart", async (event) => {
			event.feature.setStyle(await this.getStyle("drawLine"));
		});
		return draw;
	}

	initalizeFreeLine(map: Map) {
		this.initalizeLayer();
		const draw = this.initializeDraw(
			map,
			this.vectorLayer,
			this.vectorSource,
			"LineString",
			true,
		);
		draw.set("drawType", "freeLine");
		draw.on("drawstart", async (event) => {
			event.feature.setStyle(await this.getStyle("drawFreeLine"));
		});
		return draw;
	}
	initializePolygon(map: Map) {
		this.initalizeLayer();
		const draw = this.initializeDraw(
			map,
			this.vectorLayer,
			this.vectorSource,
			"Polygon",
		);
		draw.set("drawType", "polygon");
		draw.on("drawstart", async (event) => {
			event.feature.setStyle(await this.getStyle("drawPolygon"));
		});
		return draw;
	}
	initalizeFreePolygon(map: Map) {
		this.initalizeLayer();
		const draw = this.initializeDraw(
			map,
			this.vectorLayer,
			this.vectorSource,
			"Polygon",
			true,
		);
		draw.set("drawType", "freePolygon");
		draw.on("drawstart", async (event) => {
			event.feature.setStyle(await this.getStyle("drawFreePolygon"));
		});
		return draw;
	}

	initializeFigure(map: Map, type: Type, figure?: GeometryFunction) {
		this.initalizeLayer();
		const draw = this.initializeDraw(
			map,
			this.vectorLayer,
			this.vectorSource,
			type,
			false,
			figure,
		);
		draw.set("drawType", "figure");
		draw.on("drawstart", async (event) => {
			event.feature.setStyle(await this.getStyle("drawFigure"));
		});
		return draw;
	}

	setSize(size: number, tool: DrawToolKey) {
		switch (tool) {
			case "drawPoint":
				this.point.size = size;
				break;
			case "drawLine":
				this.line.size = size;
				break;
			case "drawPolygon":
				this.polygon.size = size;
				break;
			case "drawFreeLine":
				this.freeLine.size = size;
				break;
			case "drawFreePolygon":
				this.freePolygon.size = size;
				break;
			case "drawFigure":
				this.figure.size = size;
				break;
		}
	}

	getSize(tool: DrawToolKey): number | undefined {
		switch (tool) {
			case "drawPoint":
				return this.point.size;
			case "drawLine":
				return this.line.size;
			case "drawPolygon":
				return this.polygon.size;
			case "drawFreeLine":
				return this.freeLine.size;
			case "drawFreePolygon":
				return this.freePolygon.size;
			case "drawFigure":
				return this.figure.size;
		}
	}

	setColor(color: string, tool: DrawToolKey, type?: string) {
		switch (tool) {
			case "drawPoint":
				this.point.color = color;
				this.colorChanged.next(color);
				break;
			case "drawLine":
				this.line.color = color;
				this.colorChanged.next(color);
				break;
			case "drawPolygon":
				if (type == "polygon") {
					const oldFillColor = this.polygon.fillColor;
					this.polygon.fillColor = this.replaceAlpha(oldFillColor, color);

					const oldStrokeColor = this.polygon.strokeColor;
					this.polygon.strokeColor = this.replaceAlpha(oldStrokeColor, color);
				}
				if (type == "fill") {
					this.polygon.fillColor = color;
					this.colorChanged.next(color);
				}

				if (type == "stroke") {
					this.polygon.strokeColor = color;
					this.colorChanged.next(color);
				}
				this.polygon.color = this.polygon.fillColor + this.polygon.strokeColor;
				break;

			case "drawFreeLine":
				this.freeLine.color = color;
				this.colorChanged.next(color);
				break;
			case "drawFreePolygon":
				if (type == "polygon") {
					const oldFillColor = this.freePolygon.fillColor;
					this.freePolygon.fillColor = this.replaceAlpha(oldFillColor, color);

					const oldStrokeColor = this.freePolygon.strokeColor;
					this.freePolygon.strokeColor = this.replaceAlpha(
						oldStrokeColor,
						color,
					);
				}
				if (type == "fill") {
					this.freePolygon.fillColor = color;
					this.colorChanged.next(color);
				}

				if (type == "stroke") {
					this.freePolygon.strokeColor = color;
					this.colorChanged.next(color);
				}
				this.freePolygon.color =
					this.freePolygon.fillColor + this.freePolygon.strokeColor;
				break;
			case "drawFigure":
				if (type == "figure") {
					const oldFillColor = this.figure.fillColor;
					this.figure.fillColor = this.replaceAlpha(oldFillColor, color);

					const oldStrokeColor = this.figure.strokeColor;
					this.figure.strokeColor = this.replaceAlpha(oldStrokeColor, color);
				}
				if (type == "fill") {
					this.figure.fillColor = color;
					this.colorChanged.next(color);
				}

				if (type == "stroke") {
					this.figure.strokeColor = color;
					this.colorChanged.next(color);
				}
				this.figure.color = this.figure.fillColor + this.figure.strokeColor;
				break;
		}
	}

	getColor(tool: DrawToolKey): string | undefined {
		switch (tool) {
			case "drawPoint":
				return this.point.color;
			case "drawLine":
				return this.line.color;
			case "drawPolygon":
				return this.polygon.color;
			case "drawFreeLine":
				return this.freeLine.color;
			case "drawFreePolygon":
				return this.freePolygon.color;
			case "drawFigure":
				return this.figure.color;
		}
	}

	setStyle(tool: DrawToolKey, style: string) {
		switch (tool) {
			case "drawPoint":
				this.point.style = style;
				break;
			case "drawLine":
				this.line.style = style;
				break;
			case "drawPolygon":
				this.polygon.strokeStyle = style;
				break;
			case "drawFreeLine":
				this.freeLine.style = style;
				break;
			case "drawFreePolygon":
				this.freePolygon.strokeStyle = style;
				break;
			case "drawFigure":
				this.figure.strokeStyle = style;
				break;
		}
	}

	async setPolygonFill(style: string) {
		switch (style) {
			case "VerticalHatching":
				this.polygon.fillStyle = await this.stylePatternSimplePoly(
					"vertical.png",
					this.polygon.fillColor,
				);
				break;
			case "HorizontalHatching":
				this.polygon.fillStyle = await this.stylePatternSimplePoly(
					"horizontal.png",
					this.polygon.fillColor,
				);
				break;
			case "CrossHatching":
				this.polygon.fillStyle = await this.stylePatternSimplePoly(
					"square.png",
					this.polygon.fillColor,
				);
				break;
			case "DiagonalHatching":
				this.polygon.fillStyle = await this.stylePatternSimplePoly(
					"diagonal.png",
					this.polygon.fillColor,
				);
				break;
			case "ReverseDiagonalHatching":
				this.polygon.fillStyle = await this.stylePatternSimplePoly(
					"reverseDiagonal.png",
					this.polygon.fillColor,
				);
				break;
			case "DiagonalCrossHatching":
				this.polygon.fillStyle = await this.stylePatternSimplePoly(
					"cross.png",
					this.polygon.fillColor,
				);
				break;
		}
	}

	getPolygonFill() {
		return this.stylePatternSimplePoly(
			this.polygon.pattern,
			this.polygon.fillColor,
		);
	}

	async setFreePolygonFill(style: string) {
		switch (style) {
			case "VerticalHatching":
				this.freePolygon.fillStyle = await this.stylePatternSimplePoly(
					"vertical.png",
					this.freePolygon.fillColor,
				);
				break;
			case "HorizontalHatching":
				this.freePolygon.fillStyle = await this.stylePatternSimplePoly(
					"horizontal.png",
					this.freePolygon.fillColor,
				);
				break;
			case "CrossHatching":
				this.freePolygon.fillStyle = await this.stylePatternSimplePoly(
					"square.png",
					this.freePolygon.fillColor,
				);
				break;
			case "DiagonalHatching":
				this.freePolygon.fillStyle = await this.stylePatternSimplePoly(
					"diagonal.png",
					this.freePolygon.fillColor,
				);
				break;
			case "ReverseDiagonalHatching":
				this.freePolygon.fillStyle = await this.stylePatternSimplePoly(
					"reverseDiagonal.png",
					this.freePolygon.fillColor,
				);
				break;
			case "DiagonalCrossHatching":
				this.freePolygon.fillStyle = await this.stylePatternSimplePoly(
					"cross.png",
					this.freePolygon.fillColor,
				);
				break;
		}
	}
	getFreePolygonFill() {
		return this.stylePatternSimplePoly(
			this.freePolygon.pattern,
			this.freePolygon.fillColor,
		);
	}

	async setFigureFill(style: string) {
		switch (style) {
			case "VerticalHatching":
				this.figure.fillStyle = await this.stylePatternSimplePoly(
					"vertical.png",
					this.figure.fillColor,
				);
				break;
			case "HorizontalHatching":
				this.figure.fillStyle = await this.stylePatternSimplePoly(
					"horizontal.png",
					this.figure.fillColor,
				);
				break;
			case "CrossHatching":
				this.figure.fillStyle = await this.stylePatternSimplePoly(
					"square.png",
					this.figure.fillColor,
				);
				break;
			case "DiagonalHatching":
				this.figure.fillStyle = await this.stylePatternSimplePoly(
					"diagonal.png",
					this.figure.fillColor,
				);
				break;
			case "ReverseDiagonalHatching":
				this.figure.fillStyle = await this.stylePatternSimplePoly(
					"reverseDiagonal.png",
					this.figure.fillColor,
				);
				break;
			case "DiagonalCrossHatching":
				this.figure.fillStyle = await this.stylePatternSimplePoly(
					"cross.png",
					this.figure.fillColor,
				);
				break;
		}
	}

	getFigureFill() {
		return this.stylePatternSimplePoly(
			this.figure.pattern,
			this.figure.fillColor,
		);
	}

	async getStyle(tool: DrawToolKey): Promise<Style | undefined> {
		let size: number | undefined;
		let color;
		let options: DrawOptions = {};
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
				switch (this.point.style) {
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
				switch (this.line.style) {
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

				fillColor = this.polygon.fillColor;

				strokeColor = this.polygon.strokeColor;
				this.polygon.fillStyle = await this.getPolygonFill();

				options = {
					stroke: new Stroke({
						color: strokeColor,
						width: size,
						lineDash: this.polygon.dash,
					}),
					fill: new Fill({
						color: this.polygon.fillStyle,
					}),
				};

				switch (this.polygon.strokeStyle) {
					case "Dashed":
						options.stroke = new Stroke({
							color: strokeColor,
							width: size,
							lineDash: [16, 8],
						});

						this.polygon.dash = [16, 8];

						options.fill = new Fill({
							color: this.polygon.fillStyle,
						});
						break;
					case "DashDot":
						options.stroke = new Stroke({
							color: strokeColor,
							width: size,
							lineDash: [16, 16, 0, 16],
						});
						this.polygon.dash = [16, 16, 0, 16];
						options.fill = new Fill({
							color: this.polygon.fillStyle,
						});
						break;
					case "Dotted":
						options.stroke = new Stroke({
							color: strokeColor,
							width: size,
							lineDash: [0, 8],
						});
						this.polygon.dash = [0, 8];
						options.fill = new Fill({
							color: this.polygon.fillStyle,
						});
						break;
					case "DashDotDot":
						options.stroke = new Stroke({
							color: strokeColor,
							width: size,
							lineDash: [16, 16, 0, 16, 0, 16],
						});
						this.polygon.dash = [16, 16, 0, 16, 0, 16];
						options.fill = new Fill({
							color: this.polygon.fillStyle,
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
						this.polygon.dash = undefined;
				}
				if (!this.polygon.fillStyle) {
					options.fill = new Fill({
						color: this.polygon.fillColor,
					});
				}
				this.polygon.color = fillColor + strokeColor;
				return new Style(options);
			case "drawFreeLine":
				size = this.getSize(tool);
				color = this.getColor(tool);
				options = {
					stroke: new Stroke({
						color: color,
						width: size,
					}),
				};
				switch (this.freeLine.style) {
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

				fillColor = this.freePolygon.fillColor;

				strokeColor = this.freePolygon.strokeColor;
				this.freePolygon.fillStyle = await this.getFreePolygonFill();

				options = {
					stroke: new Stroke({
						color: strokeColor,
						width: size,
						lineDash: this.freePolygon.dash,
					}),
					fill: new Fill({
						color: this.freePolygon.fillStyle,
					}),
				};

				switch (this.freePolygon.strokeStyle) {
					case "Dashed":
						options.stroke = new Stroke({
							color: strokeColor,
							width: size,
							lineDash: [16, 8],
						});

						this.freePolygon.dash = [16, 8];

						options.fill = new Fill({
							color: this.freePolygon.fillStyle,
						});
						break;
					case "DashDot":
						options.stroke = new Stroke({
							color: strokeColor,
							width: size,
							lineDash: [16, 16, 0, 16],
						});
						this.freePolygon.dash = [16, 16, 0, 16];
						options.fill = new Fill({
							color: this.freePolygon.fillStyle,
						});
						break;
					case "Dotted":
						options.stroke = new Stroke({
							color: strokeColor,
							width: size,
							lineDash: [0, 8],
						});
						this.freePolygon.dash = [0, 8];
						options.fill = new Fill({
							color: this.freePolygon.fillStyle,
						});
						break;
					case "DashDotDot":
						options.stroke = new Stroke({
							color: strokeColor,
							width: size,
							lineDash: [16, 16, 0, 16, 0, 16],
						});
						this.freePolygon.dash = [16, 16, 0, 16, 0, 16];
						options.fill = new Fill({
							color: this.freePolygon.fillStyle,
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
						this.freePolygon.dash = undefined;
				}
				if (!this.freePolygon.fillStyle) {
					options.fill = new Fill({
						color: this.freePolygon.fillColor,
					});
				}

				this.freePolygon.color = fillColor + strokeColor;
				return new Style(options);
			case "drawFigure":
				size = this.getSize(tool);

				fillColor = this.figure.fillColor;

				strokeColor = this.figure.strokeColor;
				this.figure.fillStyle = await this.getFigureFill();

				options = {
					stroke: new Stroke({
						color: strokeColor,
						width: size,
						lineDash: this.figure.dash,
					}),
					fill: new Fill({
						color: this.figure.fillStyle,
					}),
				};

				switch (this.figure.strokeStyle) {
					case "Dashed":
						options.stroke = new Stroke({
							color: strokeColor,
							width: size,
							lineDash: [16, 8],
						});

						this.figure.dash = [16, 8];

						options.fill = new Fill({
							color: this.figure.fillStyle,
						});
						break;
					case "DashDot":
						options.stroke = new Stroke({
							color: strokeColor,
							width: size,
							lineDash: [16, 16, 0, 16],
						});
						this.figure.dash = [16, 16, 0, 16];
						options.fill = new Fill({
							color: this.figure.fillStyle,
						});
						break;
					case "Dotted":
						options.stroke = new Stroke({
							color: strokeColor,
							width: size,
							lineDash: [0, 8],
						});
						this.figure.dash = [0, 8];
						options.fill = new Fill({
							color: this.figure.fillStyle,
						});
						break;
					case "DashDotDot":
						options.stroke = new Stroke({
							color: strokeColor,
							width: size,
							lineDash: [16, 16, 0, 16, 0, 16],
						});
						this.figure.dash = [16, 16, 0, 16, 0, 16];
						options.fill = new Fill({
							color: this.figure.fillStyle,
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
						this.figure.dash = undefined;
				}
				if (!this.figure.fillStyle) {
					options.fill = new Fill({
						color: this.figure.fillColor,
					});
				}

				this.figure.color = fillColor + strokeColor;
				return new Style(options);
		}
	}
}
