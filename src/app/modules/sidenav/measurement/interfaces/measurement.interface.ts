
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import Polygon from "ol/geom/Polygon";
import Circle from "ol/geom/Circle";
import { Overlay } from "ol";
import { CircleComponent } from "../geometry/circle/circle.component";
import { LineComponent } from "../geometry/line/line.component";
import { PointComponent } from "../geometry/point/point.component";
import { PolygonComponent } from "../geometry/polygon/polygon.component";
import { Coordinate } from "ol/coordinate";

type MeasurementGeometry = Point | LineString | Polygon | Circle;

export interface Measurement<T extends MeasurementGeometry> {
	type: string;
	id: number;
	feature: Feature<T>;
	measureTooltips?: Map<number, Overlay>;
}

export interface MeasurementPoint extends Measurement<Point> {
	coordinates: Coordinate;
}

export interface MeasurementLine extends Measurement<LineString> {
	length: string;
}

export interface MeasurementPolygon extends Measurement<Polygon> {
	area: string;
	perimeter: string;
}

export interface MeasurementCircle extends Measurement<Circle> {
	radius: string;
}

// export type MeasurementMode = "point" | "line" | "polygon" | "circle";

export type MeasurementType =
	| MeasurementPoint
	| MeasurementLine
	| MeasurementPolygon
	| MeasurementCircle | null;

export type MeasurementComponent =
	| PointComponent
	| LineComponent
	| PolygonComponent
	| CircleComponent;

export interface MeasurementComponentBase {
	resetPoint?(): void;
	resetLine?(): void;
	resetPolygon?(): void;
	resetCircle?(): void;
}
