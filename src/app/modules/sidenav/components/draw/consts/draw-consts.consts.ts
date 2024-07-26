import {
	DrawFillStyles,
	DrawStrokeStyles,
	DrawPointStyles,
	DrawToolKey,
} from "../interfaces/draw.interface";

export const STROKE_STYLES: DrawStrokeStyles = [
	"Solid",
	"Dotted",
	"Dashed",
	"DashDot",
	"DashDotDot",
];

export const FILL_STYLES: DrawFillStyles = [
	"Solid",
	"VerticalHatching",
	"HorizontalHatching",
	"CrossHatching",
	"DiagonalHatching",
	"ReverseDiagonalHatching",
	"DiagonalCrossHatching",
];

export const POINT_SHAPES: DrawPointStyles = [
	"Circle",
	"Cross",
	"Square",
	"Diamond",
	"Cancel",
];

export const TOOLS: Array<DrawToolKey> = [
	"drawPoint",
	"drawLine",
	"drawFreeLine",
	"drawPolygon",
	"drawFreePolygon",
	"drawFigure",
];
