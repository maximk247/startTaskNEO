export enum DrawType {
	Measurement = "measurement",
	Draw = "draw",
	Coordinates = "coordinates",
}

export enum ColorType {
	Stroke = "stroke",
	Fill = "fill",
	Polygon = "polygon",
	Figure = "figure",
}

export enum Tools {
	Point = "drawPoint",
	Line = "drawLine",
	FreeLine = "drawFreeLine",
	Polygon = "drawPolygon",
	FreePolygon = "drawFreePolygon",
	Figure = "drawFigure",
}

export enum PointStyles {
	Cross = "Cross",
	Diamond = "Diamond",
	Square = "Square",
	Circle = "Circle",
	Cancel = "Cancel",
}

export enum StrokeStyles {
	Solid = "Solid",
	Dotted = "Dotted",
	Dashed = "Dashed",
	DashDot = "DashDot",
	DashDotDot = "DashDotDot",
}

export enum FillStyles {
	Solid = "Solid",
	VerticalHatching = "VerticalHatching",
	HorizontalHatching = "HorizontalHatching",
	CrossHatching = "CrossHatching",
	DiagonalHatching = "DiagonalHatching",
	ReverseDiagonalHatching = "ReverseDiagonalHatching",
	DiagonalCrossHatching = "DiagonalCrossHatching",
}
