import { Injectable } from "@angular/core";
import { Type } from "ol/geom/Geometry";
import { Interaction } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import VectorSource from "ol/source/Vector";
import { Style, RegularShape, Stroke, Fill } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { GeometryFunction } from "ol/interaction/Draw.js";
import { Subject } from "rxjs";
import {
	DrawToolKey,
	FillColor,
	DrawOptions,
	DrawPoint,
	DrawLine,
	DrawPolygon,
	DrawFigure,
	StrokeStyle,
	DrawToolOptions,
} from "./interfaces/draw.interface";

import {
	ColorType,
	FillStyles,
	PointStyles,
	StrokeStyles,
	Tools,
} from "./enum/draw.enum";
import { SidenavTools } from "../interfaces/sidenav.interface";
import { CustomDraw } from "../../shared/classes/draw-interaction.class";

@Injectable({
	providedIn: "root",
})
export class DrawService {
	private point = this.createDefaultPoint();

	private line = this.createDefaultLine();

	private freeLine = this.createDefaultLine();

	private polygon = this.createDefaultPolygon();

	private freePolygon = this.createDefaultPolygon();

	private figure = this.createDefaultFigure();

	private vectorLayer: VectorLayer<VectorSource>;
	private vectorSource: VectorSource;

	public colorChanged = new Subject<string>();
	private createDefaultPolygon(): DrawPolygon {
		return {
			size: 10,
			fillStyle: null,
			strokeStyle: null,
			color: "rgba(0, 0, 255, 1)",
			fillColor: "rgba(255, 0, 0, 1)",
			strokeColor: "rgba(0, 0, 255, 1)",
			pattern: "none",
			dash: [5, 5],
		};
	}
	private createDefaultLine(): DrawLine {
		return {
			size: 2,
			strokeStyle: "Solid",
			color: "rgba(255, 0, 0, 1)",
			dash: [5, 5],
		};
	}

	private createDefaultFigure(): DrawFigure {
		return {
			size: 10,
			fillStyle: null,
			strokeStyle: null,
			color: "rgba(0, 0, 255, 1)",
			fillColor: "rgba(255, 0, 0, 1)",
			strokeColor: "rgba(0, 0, 255, 1)",
			pattern: "none",
			dash: [5, 5],
		};
	}

	private createDefaultPoint(): DrawPoint {
		return {
			size: 10,
			shape: "Circle",
			color: "rgba(0, 255, 0, 1)",
		};
	}
	private async stylePatternSimplePoly(
		pattern: string,
		fillColor: FillColor,
		tool: DrawToolKey,
	): Promise<CanvasPattern | null> {
		return new Promise((resolve, reject) => {
			const vectorImage = new Image();
			vectorImage.crossOrigin = "anonymous";
			vectorImage.src = "../../../assets/images/" + pattern;
			this.setToolPattern(tool, pattern);
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
	private setToolPattern(tool: DrawToolKey, pattern: string) {
		switch (tool) {
			case Tools.Polygon:
				this.polygon.pattern = pattern;
				break;
			case Tools.FreePolygon:
				this.freePolygon.pattern = pattern;
				break;
			case Tools.Figure:
				this.figure.pattern = pattern;
				break;
		}
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
		const draw = new CustomDraw({
			source: source,
			type: type,
			freehand: freehand,
			geometryFunction: geometryFunction,
		});
		map.addInteraction(draw);
		return draw;
	}

	public initializeLayer() {
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

	private initializeDrawingTool(
		map: Map,
		tool: DrawToolKey,
		type: Type,
		freehand = false,
		geometryFunction?: GeometryFunction,
	) {
		this.initializeLayer();
		const draw = this.initializeDraw(
			map,
			this.vectorLayer,
			this.vectorSource,
			type,
			freehand,
			geometryFunction,
		);
		draw.set("sidenavTool", SidenavTools.Draw);
		draw.on("drawstart", async (event) => {
			if (tool !== Tools.Point) {
				draw.flag = true;
			}
			event.feature.set("sidenavTool", SidenavTools.Draw);
			event.feature.setStyle(await this.getStyle(tool));
		});

		draw.on("drawend", () => {
			draw.flag = false;
		});

		return draw;
	}

	public initializePoint(map: Map) {
		return this.initializeDrawingTool(map, Tools.Point, "Point");
	}

	public initializeLine(map: Map) {
		return this.initializeDrawingTool(map, Tools.Line, "LineString");
	}

	public initalizeFreeLine(map: Map) {
		return this.initializeDrawingTool(map, Tools.FreeLine, "LineString", true);
	}

	public initializePolygon(map: Map) {
		return this.initializeDrawingTool(map, Tools.Polygon, "Polygon");
	}

	public initalizeFreePolygon(map: Map) {
		return this.initializeDrawingTool(map, Tools.FreePolygon, "Polygon", true);
	}

	public initializeFigure(map: Map, type: Type, figure?: GeometryFunction) {
		return this.initializeDrawingTool(map, Tools.Figure, type, false, figure);
	}

	private getToolOptions(tool: DrawToolKey) {
		switch (tool) {
			case Tools.Point:
				return this.point;
			case Tools.Line:
				return this.line;
			case Tools.Polygon:
				return this.polygon;
			case Tools.FreeLine:
				return this.freeLine;
			case Tools.FreePolygon:
				return this.freePolygon;
			case Tools.Figure:
				return this.figure;
		}
	}

	public setSize(size: number, tool: DrawToolKey) {
		this.getToolOptions(tool)!.size = size;
	}

	public getSize(tool: DrawToolKey): number | undefined {
		return this.getToolOptions(tool)?.size;
	}
	private isPolygonTool(
		toolOptions: DrawToolOptions,
	): toolOptions is DrawPolygon | DrawFigure {
		return (
			(toolOptions as DrawPolygon).fillColor !== undefined &&
			(toolOptions as DrawPolygon).strokeColor !== undefined
		);
	}

	private isHasStroke(
		toolOptions: DrawToolOptions,
	): toolOptions is DrawLine | DrawPolygon | DrawFigure {
		return (
			(toolOptions as DrawLine).strokeStyle !== undefined ||
			(toolOptions as DrawPolygon).strokeStyle !== undefined
		);
	}

	public setColor(color: string, tool: DrawToolKey, type?: string) {
		const toolOptions = this.getToolOptions(tool);
		if (this.isPolygonTool(toolOptions)) {
			if (type === ColorType.Polygon) {
				toolOptions.fillColor = this.replaceAlpha(toolOptions.fillColor, color);
				toolOptions.strokeColor = this.replaceAlpha(
					toolOptions.strokeColor,
					color,
				);
			} else if (type === ColorType.Fill) {
				toolOptions.fillColor = color;
			} else if (type === ColorType.Stroke) {
				toolOptions.strokeColor = color;
			}
			toolOptions.color = toolOptions.fillColor + toolOptions.strokeColor;
		} else {
			toolOptions!.color = color;
		}
		this.colorChanged.next(color);
	}

	public getColor(tool: DrawToolKey): string | undefined {
		return this.getToolOptions(tool)?.color;
	}

	private getPatternImageName(style: string): string {
		switch (style) {
			case FillStyles.VerticalHatching:
				return "vertical.png";
			case FillStyles.HorizontalHatching:
				return "horizontal.png";
			case FillStyles.CrossHatching:
				return "square.png";
			case FillStyles.DiagonalHatching:
				return "diagonal.png";
			case FillStyles.ReverseDiagonalHatching:
				return "reverseDiagonal.png";
			case FillStyles.DiagonalCrossHatching:
				return "cross.png";
			default:
				return "";
		}
	}

	private async setPolygonFill(style: string) {
		this.polygon.fillStyle = await this.stylePatternSimplePoly(
			this.getPatternImageName(style),
			this.polygon.fillColor,
			Tools.Polygon,
		);
	}

	private async setFreePolygonFill(style: string) {
		this.freePolygon.fillStyle = await this.stylePatternSimplePoly(
			this.getPatternImageName(style),
			this.freePolygon.fillColor,
			Tools.FreePolygon,
		);
	}

	private async setFigureFill(style: string) {
		this.figure.fillStyle = await this.stylePatternSimplePoly(
			this.getPatternImageName(style),
			this.figure.fillColor,
			Tools.Figure,
		);
	}
	private getPolygonFill() {
		return this.stylePatternSimplePoly(
			this.polygon.pattern,
			this.polygon.fillColor,
			Tools.Polygon,
		);
	}

	private getFreePolygonFill() {
		return this.stylePatternSimplePoly(
			this.freePolygon.pattern,
			this.freePolygon.fillColor,
			Tools.FreePolygon,
		);
	}

	private getFigureFill() {
		return this.stylePatternSimplePoly(
			this.figure.pattern,
			this.figure.fillColor,
			Tools.Figure,
		);
	}
	public async setFill(tool: DrawToolKey, style: string) {
		switch (tool) {
			case Tools.Polygon:
				await this.setPolygonFill(style);
				break;
			case Tools.FreePolygon:
				await this.setFreePolygonFill(style);
				break;
			case Tools.Figure:
				await this.setFigureFill(style);
				break;
		}
	}

	public async getFill(tool: DrawToolKey) {
		switch (tool) {
			case Tools.Polygon:
				return this.getPolygonFill();
			case Tools.FreePolygon:
				return this.getFreePolygonFill();
			case Tools.Figure:
				return this.getFigureFill();
		}
	}

	public setPointShape(shape: string) {
		this.point.shape = shape;
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

	public setStrokeStyle(tool: DrawToolKey, style: string) {
		const toolOptions = this.getToolOptions(tool);
		if (this.isHasStroke(toolOptions)) {
			toolOptions.strokeStyle = style;
		}
	}
	private setFillStyle(
		options: DrawOptions,
		style: CanvasPattern | null | undefined | string,
	) {
		options.fill = new Fill({
			color: style,
		});
	}
	public async getStyle(tool: DrawToolKey): Promise<Style | undefined> {
		const size = this.getSize(tool);
		const color = this.getColor(tool);
		const options: DrawOptions = {};
		switch (tool) {
			case Tools.Point:
				this.setPointStyle(options, size, color);
				break;
			case Tools.Line:
				this.setLineStyle(options, size, color, this.line.strokeStyle);
				break;
			case Tools.FreeLine:
				this.setLineStyle(options, size, color, this.freeLine.strokeStyle);
				break;
			case Tools.Polygon:
				await this.setPolygonStyle(
					options,
					size,
					tool,
					this.polygon.strokeStyle,
				);
				break;

			case Tools.FreePolygon:
				await this.setPolygonStyle(
					options,
					size,
					tool,
					this.freePolygon.strokeStyle,
				);
				break;

			case Tools.Figure:
				await this.setPolygonStyle(
					options,
					size,
					tool,
					this.figure.strokeStyle,
				);
				break;
		}
		return new Style(options);
	}

	private setPointStyle(
		options: DrawOptions,
		size: number | undefined,
		color: string | undefined,
	) {
		switch (this.point.shape) {
			case PointStyles.Cross:
				this.setImageForPoint(options, false, color, 2, 4, 0, size!, 0);
				break;
			case PointStyles.Diamond:
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
			case PointStyles.Cancel:
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
			case PointStyles.Square:
				this.setImageForPoint(options, true, color, 2, 4, Math.PI / 4, size!);
				break;
			case PointStyles.Circle:
				this.setImageForPoint(options, false, color, 2, 0, 0, size!, 0, true);
		}
	}

	private setLineStyle(
		options: DrawOptions,
		size: number | undefined,
		color: string | undefined,
		strokeStyle: StrokeStyle,
	) {
		switch (strokeStyle) {
			case StrokeStyles.Dashed:
				this.setStroke(options, color, size, [16, 8]);
				break;
			case StrokeStyles.DashDot:
				this.setStroke(options, color, size, [16, 16, 0, 16]);
				break;
			case StrokeStyles.Dotted:
				this.setStroke(options, color, size, [0, 8]);
				break;
			case StrokeStyles.DashDotDot:
				this.setStroke(options, color, size, [16, 16, 0, 16, 0, 16]);
				break;
			case StrokeStyles.Solid:
				this.setStroke(options, color, size);
		}
	}

	private async setPolygonStyle(
		options: DrawOptions,
		size: number | undefined,
		tool: DrawToolKey,
		strokeStyle?: StrokeStyle,
	) {
		const toolOptions = this.getToolOptions(tool) as DrawPolygon | DrawFigure;
		toolOptions.fillStyle = await this.getFill(tool);
		this.setStroke(options, toolOptions.strokeColor, size, toolOptions.dash);
		this.setFillStyle(options, toolOptions.fillStyle);

		if (strokeStyle) {
			switch (strokeStyle) {
				case StrokeStyles.Dashed:
					this.setStroke(options, toolOptions.strokeColor, size, [16, 8]);
					this.setFillStyle(options, toolOptions.fillStyle);
					break;
				case StrokeStyles.DashDot:
					this.setStroke(
						options,
						toolOptions.strokeColor,
						size,
						[16, 16, 0, 16],
					);
					this.setFillStyle(options, toolOptions.fillStyle);
					break;
				case StrokeStyles.Dotted:
					this.setStroke(options, toolOptions.strokeColor, size, [0, 8]);
					this.setFillStyle(options, toolOptions.fillStyle);
					break;
				case StrokeStyles.DashDotDot:
					this.setStroke(
						options,
						toolOptions.strokeColor,
						size,
						[16, 16, 0, 16, 0, 16],
					);
					this.setFillStyle(options, toolOptions.fillStyle);
					break;
				case StrokeStyles.Solid:
					this.setStroke(options, toolOptions.strokeColor, size);
					this.setFillStyle(options, toolOptions.fillColor);
			}
		}

		if (!toolOptions.fillStyle) {
			this.setFillStyle(options, toolOptions.fillColor);
		}
		toolOptions.color = toolOptions.fillColor + toolOptions.strokeColor;
	}
}
