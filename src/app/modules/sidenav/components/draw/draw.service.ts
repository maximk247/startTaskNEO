import { EventEmitter, Injectable } from "@angular/core";
import { Type } from "ol/geom/Geometry";
import { Interaction } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import VectorSource from "ol/source/Vector";
import { Style, RegularShape, Stroke, Fill, Text } from "ol/style";
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
import { SidenavTools } from "../../enums/sidenav.enums";
import { CustomDraw } from "src/app/modules/shared/classes/draw-interaction.class";
import { CoordinateSystemService } from "src/app/modules/shared/shared-components/coordinate-system-selector/coordintate-system.service";
import { Point } from "ol/geom";
import { Feature } from "ol";

@Injectable({
	providedIn: "root",
})
export class DrawService {
	public showCoordinatesFlag = false;

	public coordinatesChanged: EventEmitter<void> = new EventEmitter<void>();

	public setShowCoordinates(flag: boolean) {
		this.showCoordinatesFlag = flag;
		this.coordinatesChanged.emit();
	}

	public getShowCoordinates() {
		return this.showCoordinatesFlag;
	}

	public constructor(private coordinateSystem: CoordinateSystemService) {}

	private point = this.createDefaultPoint();

	private line = this.createDefaultLine();

	private freeLine = this.createDefaultLine();

	private polygon = this.createDefaultPolygon();

	private freePolygon = this.createDefaultPolygon();

	private figure = this.createDefaultFigure();

	private vectorLayer: VectorLayer<VectorSource>;
	private vectorSource: VectorSource;

	public colorChanged = new Subject<string>();
	public alphaChanged = new Subject<number>();
	private createDefaultPolygon(): DrawPolygon {
		return {
			size: 10,
			fillStyle: null,
			strokeStyle: null,
			color: "rgba(255, 0, 0, 1)rgba(0, 0, 255, 1)",
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
			color: "rgba(255, 0, 0, 1)rgba(0, 0, 255, 1)",
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
			if (pattern === "none") {
				resolve(null);
				return;
			}
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
	public replaceAlpha(rgbaString: string, newAlpha: string) {
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
		if (freehand === undefined) freehand = false;
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

	public async addText(feature: Feature, tool: DrawToolKey) {
		const style = (await this.getStyle(tool)) as Style;
		const geometry = feature.getGeometry() as Point;
		const coordinate = geometry.getCoordinates();

		const transformCoordinates =
			this.coordinateSystem.transformCoordinates(coordinate);

		const textStyle = new Text({
			text: `(${transformCoordinates[0]}\n ${transformCoordinates[1]})`,
			font: "12px Calibri,sans-serif",
			fill: new Fill({
				color: "#fff",
			}),
			offsetX: 0,
			offsetY: 20,
			stroke: new Stroke({
				color: "#000",
				width: 3,
			}),
			padding: [2, 2, 2, 2],
		});
		style.setText(textStyle);

		feature.setStyle(style);
	}

	private initializeDrawingTool(
		map: Map,
		tool: DrawToolKey,
		type: Type,
		freehand?: boolean,
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

		draw.on("drawend", async (event) => {
			draw.flag = false;
			if (tool === Tools.Point) {
				if (this.showCoordinatesFlag) {
					this.addText(event.feature, "drawPoint");
				}
			}
		});

		return draw;
	}

	public initializePoint(map: Map) {
		return this.initializeDrawingTool(map, Tools.Point, "Point");
	}

	public initializeLine(map: Map) {
		return this.initializeDrawingTool(map, Tools.Line, "LineString");
	}

	public initializeFreeLine(map: Map) {
		return this.initializeDrawingTool(map, Tools.FreeLine, "LineString", true);
	}

	public initializePolygon(map: Map) {
		return this.initializeDrawingTool(map, Tools.Polygon, "Polygon");
	}

	public initializeFreePolygon(map: Map) {
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

	public splitRgbaColors(color: string): {
		fillColor: string;
		strokeColor: string;
	} {
		// eslint-disable-next-line no-useless-escape
		const rgbaMatches = color.match(/rgba\([^\)]+\)/g);
		let fillColor = "";
		let strokeColor = "";

		if (rgbaMatches && rgbaMatches.length > 1) {
			[fillColor, strokeColor] = rgbaMatches;
		} else if (rgbaMatches && rgbaMatches.length === 1) {
			fillColor = strokeColor = rgbaMatches[0];
		}

		return { fillColor, strokeColor };
	}

	public setColor(color: string, tool: DrawToolKey, type?: string) {
		const toolOptions = this.getToolOptions(tool);
		if (this.isPolygonTool(toolOptions)) {
			if (type === ColorType.Fill) {
				toolOptions.fillColor = color;
			} else if (type === ColorType.Stroke) {
				toolOptions.strokeColor = color;
			}
			toolOptions.color = toolOptions.fillColor + toolOptions.strokeColor;
			if (color.length > 30) {
				const { fillColor, strokeColor } = this.splitRgbaColors(color);
				if (type === ColorType.Polygon || type === ColorType.Figure) {
					toolOptions.fillColor = fillColor;
					toolOptions.strokeColor = strokeColor;
				}
				toolOptions.color = fillColor + strokeColor;
			}
		} else {
			toolOptions!.color = color;
		}
		this.colorChanged.next(color);
	}

	public getColor(tool: DrawToolKey, type?: string): string | undefined {
		const toolOptions = this.getToolOptions(tool);
		if (this.isPolygonTool(toolOptions)) {
			if (type === ColorType.Fill) {
				return toolOptions.fillColor;
			} else if (type === ColorType.Stroke) {
				return toolOptions.strokeColor;
			}
		}
		return this.getToolOptions(tool)?.color;
	}

	public setAlpha(alpha: number, tool: DrawToolKey) {
		const toolOptions = this.getToolOptions(tool);
		if (this.isPolygonTool(toolOptions)) {
			if (toolOptions.fillColor) {
				toolOptions.fillColor = this.replaceAlpha(
					toolOptions.fillColor,
					alpha.toString(),
				);
			}
			if (toolOptions.strokeColor) {
				toolOptions.strokeColor = this.replaceAlpha(
					toolOptions.strokeColor,
					alpha.toString(),
				);
			}
			this.alphaChanged.next(alpha);
		}
	}

	public getAlpha(tool: DrawToolKey): number {
		const toolOptions = this.getToolOptions(tool);
		if (!toolOptions) {
			return 1;
		}

		let rgbaString: string;
		if (this.isPolygonTool(toolOptions)) {
			rgbaString = toolOptions.fillColor || toolOptions.strokeColor;
		} else {
			rgbaString = toolOptions.color;
		}

		if (!rgbaString) {
			return 1;
		}

		const match = rgbaString.match(/rgba\(.*?,.*?,.*?,(.*?)\)/);
		return match ? parseFloat(match[1]) : 1;
	}

	private getPatternImageName(style: string): string | undefined {
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
			case FillStyles.Solid:
				return "";
		}
	}

	private async setPolygonFill(style: string) {
		this.polygon.fillStyle = await this.stylePatternSimplePoly(
			this.getPatternImageName(style)!,
			this.polygon.fillColor,
			Tools.Polygon,
		);
	}

	private async setFreePolygonFill(style: string) {
		this.freePolygon.fillStyle = await this.stylePatternSimplePoly(
			this.getPatternImageName(style)!,
			this.freePolygon.fillColor,
			Tools.FreePolygon,
		);
	}

	private async setFigureFill(style: string) {
		this.figure.fillStyle = await this.stylePatternSimplePoly(
			this.getPatternImageName(style)!,
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
		tool: DrawToolKey,
	) {
		const toolOptions = this.getToolOptions(tool);
		if (!style && this.isPolygonTool(toolOptions)) {
			style = toolOptions.fillColor;
		}
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
			case Tools.FreeLine:
				this.setLineStyle(
					options,
					size,
					color,
					this.getToolOptions(tool) as DrawLine,
				);
				break;
			case Tools.Polygon:
			case Tools.FreePolygon:
			case Tools.Figure:
				await this.setPolygonStyle(
					options,
					size,
					tool,
					this.getToolOptions(tool) as DrawPolygon | DrawFigure,
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
		toolOptions: DrawLine | DrawPolygon | DrawFigure,
	) {
		const strokeStyle = toolOptions.strokeStyle;
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
		toolOptions: DrawPolygon | DrawFigure,
	) {
		const fillStyle = await this.getFill(tool);
		if (fillStyle) {
			toolOptions.fillStyle = fillStyle;
		}
		this.setStroke(options, toolOptions.strokeColor, size, toolOptions.dash);
		this.setFillStyle(options, toolOptions.fillStyle, tool);
		this.setPolygonStrokeStyle(
			options,
			toolOptions.strokeColor,
			size,
			toolOptions.strokeStyle,
		);
		toolOptions.color = toolOptions.fillColor + toolOptions.strokeColor;
	}
	private setPolygonStrokeStyle(
		options: DrawOptions,
		strokeColor: string | undefined,
		size: number | undefined,
		strokeStyle: StrokeStyle,
	) {
		if (strokeStyle) {
			switch (strokeStyle) {
				case StrokeStyles.Dashed:
					this.setStroke(options, strokeColor, size, [16, 8]);
					break;
				case StrokeStyles.DashDot:
					this.setStroke(options, strokeColor, size, [16, 16, 0, 16]);
					break;
				case StrokeStyles.Dotted:
					this.setStroke(options, strokeColor, size, [0, 8]);
					break;
				case StrokeStyles.DashDotDot:
					this.setStroke(options, strokeColor, size, [16, 16, 0, 16, 0, 16]);
					break;
				case StrokeStyles.Solid:
					this.setStroke(options, strokeColor, size);
					break;
			}
		}
	}
}
