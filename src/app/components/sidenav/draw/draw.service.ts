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
	private pointSize = 10;
	private color: string;

	setSize(size: number) {
		this.pointSize = size;
	}

	getSize(): number {
		return this.pointSize;
	}

	setColor(color: string) {
		this.color = color;
	}

	getColor(): string {
		return this.color;
	}
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
		const size = this.getSize();
		const color= this.getColor()
		switch (pointStyle) {
			case "Cross":
				return new Style({
					image: new RegularShape({
						stroke: new Stroke({
							color: color,
							width: 2,
						}),
						points: 4,
						radius: size,
						radius2: 0,
						angle: 0,
					}),
				});
			case "Diamond":
				return new Style({
					image: new RegularShape({
						fill: new Fill({
							color: color,
						}),
						stroke: new Stroke({
							color: color,
							width: 2,
						}),
						points: 4,
						radius: size,
						radius2: size * Math.sqrt(2),
						angle: Math.PI / 4,
					}),
				});
			case "Cancel":
				return new Style({
					image: new RegularShape({
						stroke: new Stroke({
							color: color,
							width: 2,
						}),
						points: 4,
						radius: size,
						radius2: 0,
						angle: Math.PI / 4,
					}),
				});
			case "Square":
				return new Style({
					image: new RegularShape({
						fill: new Fill({
							color: color,
						}),
						stroke: new Stroke({
							color: color,
							width: 2,
						}),
						points: 4,
						radius: size,
						angle: Math.PI / 4,
					}),
				});
			case "Circle":
			default:
				return new Style({
					image: new CircleStyle({
						radius: size,
						fill: new Fill({
							color: color,
						}),
						stroke: new Stroke({
							color: color,
							width: 2,
						}),
					}),
				});
		}
	}
}
