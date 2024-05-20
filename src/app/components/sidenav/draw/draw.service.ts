/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-case-declarations */
import { Injectable } from "@angular/core";
import Geometry, { Type } from "ol/geom/Geometry";
import { Draw, Interaction } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import VectorSource from "ol/source/Vector";
import { Style, RegularShape, Stroke, Fill, Circle } from "ol/style";
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

	public colorChanged = new Subject<string>();

	public removeAllDrawings(map: Map) {
		map.getLayers().forEach((layer) => {
			if (layer instanceof VectorLayer) {
				const source = layer.getSource();
				if (source instanceof VectorSource) {
					source.clear();
				}
			}
		});
	}

	public removeDrawingOnMouseClick(
		map: Map,
		vectorLayer: VectorLayer<VectorSource>,
	) {
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
	private async stylePatternSimplePoly(
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

	private replaceAlpha(rgbaString: string, newAlpha: string) {
		return rgbaString.replace(
			/(rgba\(\d+,\s*\d+,\s*\d+,\s*)\d*\.?\d+(\))/,
			`$1${newAlpha}$2`,
		);
	}

	public removeGlobalInteraction(
		map: Map,
		interaction: Interaction | null = null,
	) {
		if (interaction) {
			map.removeInteraction(interaction);
			interaction = null;
		}
	}

	public addGlobalInteraction(map: Map, interaction: Interaction) {
		map.addInteraction(interaction);
	}

	public initializeDraw(
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

	public initalizeLayer() {
		this.vectorSource = new VectorSource();
		this.vectorLayer = new VectorLayer({
			source: this.vectorSource,
		});
	}

	public getVectorLayer() {
		return this.vectorLayer;
	}

	public getVectorSource() {
		return this.vectorSource;
	}

	public initializePoint(map: Map) {
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

	public initializeLine(map: Map) {
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

	public initalizeFreeLine(map: Map) {
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
	public initializePolygon(map: Map) {
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
	public initalizeFreePolygon(map: Map) {
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

	public initializeFigure(map: Map, type: Type, figure?: GeometryFunction) {
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

	public setSize(size: number, tool: DrawToolKey) {
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

	public getSize(tool: DrawToolKey): number | undefined {
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

	public setColor(color: string, tool: DrawToolKey, type?: string) {
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
				if (type === "polygon") {
					this.polygon.fillColor = this.replaceAlpha(
						this.polygon.fillColor,
						color,
					);
					this.polygon.strokeColor = this.replaceAlpha(
						this.polygon.strokeColor,
						color,
					);
				}
				if (type === "fill") {
					this.polygon.fillColor = color;
					this.colorChanged.next(color);
				}

				if (type === "stroke") {
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
				if (type === "polygon") {
					this.freePolygon.fillColor = this.replaceAlpha(
						this.freePolygon.fillColor,
						color,
					);
					this.freePolygon.strokeColor = this.replaceAlpha(
						this.freePolygon.strokeColor,
						color,
					);
				}
				if (type === "fill") {
					this.freePolygon.fillColor = color;
					this.colorChanged.next(color);
				}

				if (type === "stroke") {
					this.freePolygon.strokeColor = color;
					this.colorChanged.next(color);
				}
				this.freePolygon.color =
					this.freePolygon.fillColor + this.freePolygon.strokeColor;
				break;
			case "drawFigure":
				if (type === "figure") {
					this.figure.fillColor = this.replaceAlpha(
						this.figure.fillColor,
						color,
					);
					this.figure.strokeColor = this.replaceAlpha(
						this.figure.strokeColor,
						color,
					);
				}
				if (type === "fill") {
					this.figure.fillColor = color;
					this.colorChanged.next(color);
				}

				if (type === "stroke") {
					this.figure.strokeColor = color;
					this.colorChanged.next(color);
				}
				this.figure.color = this.figure.fillColor + this.figure.strokeColor;
				break;
		}
	}

	public getColor(tool: DrawToolKey): string | undefined {
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

	
	private async setPolygonFill(style: string) {
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

	private getPolygonFill() {
		return this.stylePatternSimplePoly(
			this.polygon.pattern,
			this.polygon.fillColor,
		);
	}

	private async setFreePolygonFill(style: string) {
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
	private getFreePolygonFill() {
		return this.stylePatternSimplePoly(
			this.freePolygon.pattern,
			this.freePolygon.fillColor,
		);
	}

	private async setFigureFill(style: string) {
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

	private getFigureFill() {
		return this.stylePatternSimplePoly(
			this.figure.pattern,
			this.figure.fillColor,
		);
	}
	public async setFill(tool: DrawToolKey, style: string) {
		switch (tool) {
			case "drawPolygon":
				await this.setPolygonFill(style);
				break;
			case "drawFreePolygon":
				await this.setFreePolygonFill(style);
				break;
			case "drawFigure":
				await this.setFigureFill(style);
				break;
		}
	}

	public async getFill(tool: DrawToolKey) {
		switch (tool) {
			case "drawPolygon":
				return this.getPolygonFill();
			case "drawFreePolygon":
				return this.getFreePolygonFill();
			case "drawFigure":
				return this.getFigureFill();
		}
	}

	private setImageForPoint(
		options: DrawOptions,
		fill: boolean,
		color: string | undefined,
		width: number,
		points: number,
		angle: number,
		radius: number,
		radius2: number | undefined = undefined,
		circle?: boolean,
	) {
		const fillStyle = fill ? new Fill({ color: color }) : undefined;
		const strokeStyle = new Stroke({ color: color, width: width });

		options.image = new RegularShape({
			fill: fillStyle,
			stroke: strokeStyle,
			points: points,
			radius: radius,
			radius2: radius2,
			angle: angle,
		});

		if (circle) {
			options.image = new CircleStyle({
				radius: radius,
				fill: new Fill({
					color: color,
				}),
				stroke: new Stroke({
					color: color,
					width: width,
				}),
			});
		}
	}

	private setStroke(
		options: DrawOptions,
		color: string | undefined,
		width: number | undefined,
		lineDash: Array<number> | undefined = undefined,
	) {
		options.stroke = new Stroke({
			color: color,
			width: width,
			lineDash: lineDash,
		});
	}

	private setFillStyle(
		options: DrawOptions,
		style: CanvasPattern | null | undefined | string,
	) {
		options.fill = new Fill({
			color: style,
		});
	}
	public setStyle(tool: DrawToolKey, style: string) {
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
	public async getStyle(tool: DrawToolKey): Promise<Style | undefined> {
		let size: number | undefined;
		let color;
		const options: DrawOptions = {};
		switch (tool) {
			case "drawPoint":
				size = this.getSize(tool);
				color = this.getColor(tool);
				switch (this.point.style) {
					case "Cross":
						this.setImageForPoint(options, false, color, 2, 4, 0, size!, 0);
						break;
					case "Diamond":
						this.setImageForPoint(
							options,
							true,
							color,
							2,
							4,
							Math.PI / 4,
							size!,
							size! * Math.sqrt(2),
						);
						break;
					case "Cancel":
						this.setImageForPoint(
							options,
							false,
							color,
							2,
							4,
							Math.PI / 4,
							size!,
							0,
						);
						break;
					case "Square":
						this.setImageForPoint(
							options,
							true,
							color,
							2,
							4,
							Math.PI / 4,
							size!,
						);
						break;
					case "Circle":
						this.setImageForPoint(
							options,
							false,
							color,
							2,
							0,
							0,
							size!,
							0,
							true,
						);
				}
				return new Style(options);
			case "drawLine":
				size = this.getSize(tool);
				color = this.getColor(tool);
				switch (this.line.style) {
					case "Dashed":
						this.setStroke(options, color, size, [16, 8]);
						break;
					case "DashDot":
						this.setStroke(options, color, size, [16, 16, 0, 16]);
						break;
					case "Dotted":
						this.setStroke(options, color, size, [0, 8]);
						break;
					case "DashDotDot":
						this.setStroke(options, color, size, [16, 16, 0, 16, 0, 16]);
						break;
					case "Solid":
						this.setStroke(options, color, size);
				}

				return new Style(options);
			case "drawPolygon":
				size = this.getSize(tool);
				this.polygon.fillStyle = await this.getFill(tool);
				this.setStroke(
					options,
					this.polygon.strokeColor,
					size,
					this.polygon.dash,
				);
				this.setFillStyle(options, this.polygon.fillStyle);

				switch (this.polygon.strokeStyle) {
					case "Dashed":
						this.setStroke(options, this.polygon.strokeColor, size, [16, 8]);
						this.setFillStyle(options, this.polygon.fillStyle);
						break;
					case "DashDot":
						this.setStroke(
							options,
							this.polygon.strokeColor,
							size,
							[16, 16, 0, 16],
						);
						this.setFillStyle(options, this.polygon.fillStyle);
						break;
					case "Dotted":
						this.setStroke(options, this.polygon.strokeColor, size, [0, 8]);
						this.setFillStyle(options, this.polygon.fillStyle);
						break;
					case "DashDotDot":
						this.setStroke(
							options,
							this.polygon.strokeColor,
							size,
							[16, 16, 0, 16, 0, 16],
						);
						this.setFillStyle(options, this.polygon.fillStyle);
						break;
					case "Solid":
						this.setStroke(options, this.polygon.strokeColor, size);
						this.setFillStyle(options, this.polygon.fillColor);
				}
				if (!this.polygon.fillStyle) {
					this.setFillStyle(options, this.polygon.fillColor);
				}
				this.polygon.color = this.polygon.fillColor + this.polygon.strokeColor;
				return new Style(options);
			case "drawFreeLine":
				size = this.getSize(tool);
				color = this.getColor(tool);
				switch (this.freeLine.style) {
					case "Dashed":
						this.setStroke(options, color, size, [16, 8]);
						break;
					case "DashDot":
						this.setStroke(options, color, size, [16, 16, 0, 16]);
						break;
					case "Dotted":
						this.setStroke(options, color, size, [0, 8]);
						break;
					case "DashDotDot":
						this.setStroke(options, color, size, [16, 16, 0, 16, 0, 16]);
						break;
					case "Solid":
						this.setStroke(options, color, size);
				}

				return new Style(options);
			case "drawFreePolygon":
				size = this.getSize(tool);
				this.freePolygon.fillStyle = await this.getFreePolygonFill();
				this.setStroke(
					options,
					this.freePolygon.strokeColor,
					size,
					this.freePolygon.dash,
				);
				this.setFillStyle(options, this.freePolygon.fillStyle);

				switch (this.freePolygon.strokeStyle) {
					case "Dashed":
						this.setStroke(
							options,
							this.freePolygon.strokeColor,
							size,
							[16, 8],
						);
						this.setFillStyle(options, this.freePolygon.fillStyle);
						break;
					case "DashDot":
						this.setStroke(
							options,
							this.freePolygon.strokeColor,
							size,
							[16, 16, 0, 16],
						);
						this.setFillStyle(options, this.freePolygon.fillStyle);
						break;
					case "Dotted":
						this.setStroke(options, this.freePolygon.strokeColor, size, [0, 8]);
						this.setFillStyle(options, this.freePolygon.fillStyle);
						break;
					case "DashDotDot":
						this.setStroke(
							options,
							this.freePolygon.strokeColor,
							size,
							[16, 16, 0, 16, 0, 16],
						);
						this.setFillStyle(options, this.freePolygon.fillStyle);
						break;
					case "Solid":
						this.setStroke(options, this.freePolygon.strokeColor, size);
						this.setFillStyle(options, this.freePolygon.fillColor);
				}
				if (!this.freePolygon.fillStyle) {
					this.setFillStyle(options, this.freePolygon.fillColor);
				}

				this.freePolygon.color =
					this.freePolygon.fillColor + this.freePolygon.strokeColor;
				return new Style(options);
			case "drawFigure":
				size = this.getSize(tool);

				this.figure.fillStyle = await this.getFigureFill();

				this.setStroke(
					options,
					this.figure.strokeColor,
					size,
					this.figure.dash,
				);
				this.setFillStyle(options, this.figure.fillStyle);

				switch (this.figure.strokeStyle) {
					case "Dashed":
						this.setStroke(options, this.figure.strokeColor, size, [16, 8]);
						this.setFillStyle(options, this.figure.fillStyle);
						break;
					case "DashDot":
						this.setStroke(
							options,
							this.figure.strokeColor,
							size,
							[16, 16, 0, 16],
						);
						this.setFillStyle(options, this.figure.fillStyle);
						break;
					case "Dotted":
						this.setStroke(options, this.figure.strokeColor, size, [0, 8]);
						this.setFillStyle(options, this.figure.fillStyle);
						break;
					case "DashDotDot":
						this.setStroke(
							options,
							this.figure.strokeColor,
							size,
							[16, 16, 0, 16, 0, 16],
						);
						this.setFillStyle(options, this.figure.fillStyle);
						break;
					case "Solid":
						this.setStroke(options, this.figure.strokeColor, size);
						this.setFillStyle(options, this.figure.fillColor);
				}
				if (!this.figure.fillStyle) {
					this.setFillStyle(options, this.figure.fillColor);
				}

				this.figure.color = this.figure.fillColor + this.figure.strokeColor;
				return new Style(options);
		}
	}
}
