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

export type style = string | undefined;
export type strokeStyle = string | null | undefined;
export type fillStyle = CanvasPattern | null | undefined;
export type fillColor = string | undefined;
export type lineDash = Array<number> | undefined;

export interface DrawOptions {
	stroke?: Stroke;
	fill?: Fill;
	image?: ImageStyle;
}

export interface DrawPoint {
	size: number;
	style: style;
	color: string;
}

export interface DrawLine {
	size: number;
	style: style;
	color: string;
	dash: lineDash;
}

export interface DrawPolygon {
	size: number;
	fillStyle: fillStyle;
	strokeStyle: strokeStyle;
	color: string;
	fillColor: string;
	strokeColor: string;
	pattern: string;
	dash: lineDash;
}

export interface DrawFigure {
	size: number;
	fillStyle: fillStyle;
	strokeStyle: strokeStyle;
	color: string;
	fillColor: string;
	strokeColor: string;
	pattern: string;
	dash: lineDash;
}

export type lineStyles =
	| "Solid"
	| "Dotted"
	| "Dashed"
	| "DashDot"
	| "DashDotDot";

export type fillStyles =
	| "Solid"
	| "VerticalHatching"
	| "HorizontalHatching"
	| "CrossHatching"
	| "DiagonalHatching"
	| "ReverseDiagonalHatching"
	| "DiagonalCrossHatching";

export type pointStyle = "Circle" | "Cross" | "Square" | "Diamond" | "Cancel";

export type DrawLineStyles = Array<lineStyles>;
export type DrawFillStyles = Array<fillStyles>;
export type DrawPointStyles = Array<pointStyle>
