import { Stroke, Fill } from "ol/style";
import ImageStyle from "ol/style/Image";

export interface DrawTools {
	[index: string]: boolean;
	drawPoint: boolean;
	drawLine: boolean;
	drawFreeLine: boolean;
	drawPolygon: boolean;
	drawFreePolygon: boolean;
	drawFigure: boolean;
}

export type DrawToolKey = keyof DrawTools;

export type DrawToolOptions =
	| DrawPoint
	| DrawLine
	| DrawPolygon
	| DrawFigure
	| undefined;

export type Style = string | undefined;
export type StrokeStyle = string | null | undefined;
export type FillStyle = CanvasPattern | null | undefined;
export type FillColor = string | undefined;
export type LineDash = Array<number> | undefined;

export interface DrawOptions {
	stroke?: Stroke;
	fill?: Fill;
	image?: ImageStyle;
}

export interface DrawPoint {
	size: number;
	shape: Style;
	color: string;
}

export interface DrawLine {
	size: number;
	strokeStyle: StrokeStyle;
	color: string;
	dash: LineDash;
}

export interface DrawPolygon {
	size: number;
	fillStyle: FillStyle;
	strokeStyle: StrokeStyle;
	color: string;
	fillColor: string;
	strokeColor: string;
	pattern: string;
	dash: LineDash;
}

export interface DrawFigure {
	size: number;
	fillStyle: FillStyle;
	strokeStyle: StrokeStyle;
	color: string;
	fillColor: string;
	strokeColor: string;
	pattern: string;
	dash: LineDash;
}

export type StrokeStyles =
	| "Solid"
	| "Dotted"
	| "Dashed"
	| "DashDot"
	| "DashDotDot";

export type FillStyles =
	| "Solid"
	| "VerticalHatching"
	| "HorizontalHatching"
	| "CrossHatching"
	| "DiagonalHatching"
	| "ReverseDiagonalHatching"
	| "DiagonalCrossHatching";

export type PointStyles = "Circle" | "Cross" | "Square" | "Diamond" | "Cancel";

export type DrawStrokeStyles = Array<StrokeStyles>;
export type DrawFillStyles = Array<FillStyles>;
export type DrawPointStyles = Array<PointStyles>;
