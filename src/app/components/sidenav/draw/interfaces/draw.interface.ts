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

export type DrawStyle = string | undefined;
export type DrawStrokeStyle = string | null | undefined;
export type DrawFillStyle = CanvasPattern | null | undefined;
export type DrawLineDash = Array<number> | undefined;
export type DrawFillColor = string | undefined;
export interface DrawOptions {
	stroke?: Stroke;
	fill?: Fill;
	image?: ImageStyle;
}

export interface DrawPoint {
	size: number;
	style: DrawStyle;
	color: string;
}

export interface DrawLine {
	size: number;
	style: DrawStyle;
	color: string;
	dash: DrawLineDash;
}

export interface DrawPolygon {
	size: number;
	fillStyle: DrawFillStyle;
	strokeStyle: DrawStrokeStyle;
	color: string;
	fillColor: string;
	strokeColor: string;
	pattern: string;
}

export interface DrawFigure {
	size: number;
	fillStyle: DrawFillStyle;
	strokeStyle: DrawStrokeStyle;
	color: string;
	fillColor: string;
	strokeColor: string;
	pattern: string;
}

export type DrawLineStyle = string;

export type DrawPolygonFillStyle = string;

export type DrawLineStyles = Array<DrawLineStyle>;
export type DrawPolygonFillStyles = Array<DrawPolygonFillStyle>;
