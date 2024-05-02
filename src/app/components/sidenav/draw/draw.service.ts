import { Injectable } from "@angular/core";
import { Type } from "ol/geom/Geometry";
import { Draw } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import VectorSource from "ol/source/Vector";
import { Style, RegularShape, Stroke, Fill } from "ol/style";
import CircleStyle from "ol/style/Circle";

@Injectable({
	providedIn: "root",
})
export class DrawService {
	initializeDraw(
		map: Map,
		vector: VectorLayer<VectorSource>,
		source: VectorSource,
		type: Type,
		freehand?: boolean,
	) {
		map.addLayer(vector);
		const draw = new Draw({
			source: source,
			type: type,
			freehand: freehand,
		});
		map.addInteraction(draw);
		return draw;
	}

	initalizeLayer(source: VectorSource) {
		const vector = new VectorLayer({
			source: source,
		});
		return vector;
	}

	initializePoint(map: Map) {
		const source = new VectorSource();
		const vector = this.initalizeLayer(source);
		const draw = this.initializeDraw(map, vector, source, "Point");
		return draw;
	}

	initializeCircle(map: Map) {
		const source = new VectorSource();
		const vector = this.initalizeLayer(source);
		const draw = this.initializeDraw(map, vector, source, "Circle");
		return draw;
	}

	initializeLineString(map: Map) {
		const source = new VectorSource();
		const vector = this.initalizeLayer(source);
		const draw = this.initializeDraw(map, vector, source, "LineString");
		return draw;
	}

	initializePolygon(map: Map) {
		const source = new VectorSource();
		const vector = this.initalizeLayer(source);
		const draw = this.initializeDraw(map, vector, source, "Polygon");
		return draw;
	}

	initalizeFreeLineString(map: Map) {
		const source = new VectorSource();
		const vector = this.initalizeLayer(source);
		const draw = this.initializeDraw(map, vector, source, "LineString", true);
		return draw;
	}
	initalizeFreePolygon(map: Map) {
		const source = new VectorSource();
		const vector = this.initalizeLayer(source);
		const draw = this.initializeDraw(map, vector, source, "Polygon", true);
		return draw;
	}
	getPointStyle(pointStyle: string) {
		switch (pointStyle) {
			case "Cross":
				return new Style({
					image: new RegularShape({
						stroke: new Stroke({
							color: "red",
							width: 2,
						}),
						points: 4,
						radius: 10,
						radius2: 0,
						angle: 0,
					}),
				});
			case "Diamond":
				return new Style({
					image: new RegularShape({
						fill: new Fill({
							color: "yellow",
						}),
						stroke: new Stroke({
							color: "black",
							width: 2,
						}),
						points: 4,
						radius: 10,
						radius2: 10 * Math.sqrt(2),
						angle: Math.PI / 4,
					}),
				});
			case "Cancel":
				return new Style({
					image: new RegularShape({
						stroke: new Stroke({
							color: "red",
							width: 2,
						}),
						points: 4,
						radius: 10,
						radius2: 0,
						angle: Math.PI / 4,
					}),
				});
			case "Square":
				return new Style({
					image: new RegularShape({
						fill: new Fill({
							color: "blue",
						}),
						stroke: new Stroke({
							color: "black",
							width: 2,
						}),
						points: 4,
						radius: 10,
						angle: Math.PI / 4,
					}),
				});
			case "Circle":
			default:
				return new Style({
					image: new CircleStyle({
						radius: 10,
						fill: new Fill({
							color: "green",
						}),
						stroke: new Stroke({
							color: "black",
							width: 2,
						}),
					}),
				});
		}
	}
}
