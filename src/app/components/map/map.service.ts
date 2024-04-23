// map.service.ts
import { Injectable } from "@angular/core";
import Map from "ol/Map";
import View from "ol/View";
import ScaleLine from "ol/control/ScaleLine";
import { toStringHDMS } from "ol/coordinate";
import MousePosition from "ol/control/MousePosition";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

@Injectable({
	providedIn: "root",
})
export class MapService {
	map: Map;

	mousePositionControl: MousePosition;

	initMap(
		target: string,
		scaleBarElement: HTMLElement,
		mousePositionElement: HTMLElement,
	) {
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
					target: scaleBarElement,
					bar: true,
					steps: 4,
					text: true,
					minWidth: 140,
					className: "ol-scale-bar ",
				}),
				new MousePosition({
					coordinateFormat: (coordinate: any): string => {
						return toStringHDMS(coordinate);
					},
					className: "ol-mouse-position",
					target: mousePositionElement,
				}),
			],
		});
	}
}
