// map.service.ts
import { Injectable } from "@angular/core";
import Map from "ol/Map";
import View from "ol/View";
import ScaleLine from "ol/control/ScaleLine";
import { Coordinate, toStringHDMS } from "ol/coordinate";
import MousePosition from "ol/control/MousePosition";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { Draw, Modify, Snap } from "ol/interaction";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

@Injectable({
	providedIn: "root",
})
export class MapService {
	map: Map;

	mousePositionControl: MousePosition;

	initMap(target: string) {
		this.map = new Map({
			target: target,

			view: new View({
				center: [0, 0],
				zoom: 1,
			}),
			layers: [
				new TileLayer({
					source: new OSM(),
				}),
			],

			controls: [
				new ScaleLine({
					target: "controls",
					bar: true,
					steps: 4,
					text: true,
					minWidth: 140,
				}),
				new MousePosition({
					coordinateFormat: (coordinate?: Coordinate): string => {
						return toStringHDMS(coordinate as Coordinate);
					},
					target: "controls",
				}),
			],
		});
		const source = new VectorSource();
		const vector = new VectorLayer({
			source: source,
			style: new Style({
				fill: new Fill({
					color: "rgba(255, 255, 255, 0.2)",
				}),
				stroke: new Stroke({
					color: "#ffcc33",
					width: 2,
				}),
				image: new CircleStyle({
					radius: 7,
					fill: new Fill({
						color: "#ffcc33",
					}),
				}),
			}),
		});
		this.map.addLayer(vector);

		const draw = new Draw({
			source: source,
			type: "Polygon",
		});
		this.map.addInteraction(draw);
	}
}
