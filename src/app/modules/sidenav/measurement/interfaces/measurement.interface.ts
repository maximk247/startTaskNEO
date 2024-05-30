// measurement.interface.ts

import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import Polygon from "ol/geom/Polygon";
import Circle from "ol/geom/Circle";
import { Overlay } from "ol";

type MeasurementGeometry = Point | LineString | Polygon | Circle;

export interface Measurement<T extends MeasurementGeometry> {
	id: number;
	feature: Feature<T>;
}

export interface MeasurementPoint extends Measurement<Point> {
	coordinates: Array<number> ;
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

export type MeasurementMode = "point" | "line" | "polygon" | "circle";

export interface PointsChangeEvent {
	points: Array<MeasurementPoint>;
	overlay: Map<number, Overlay>;
}
