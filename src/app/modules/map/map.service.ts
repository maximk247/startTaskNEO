// map.service.ts
import { Injectable } from "@angular/core";
import Map from "ol/Map";
import View from "ol/View";
import ScaleLine from "ol/control/ScaleLine";
import { Coordinate, toStringHDMS } from "ol/coordinate";
import MousePosition from "ol/control/MousePosition";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { Feature } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { ZoomSlider } from "ol/control";
import { useGeographic } from "ol/proj";
import { Circle, Geometry, LineString, Point, Polygon } from "ol/geom";
import { SidenavTools } from "../sidenav/enums/sidenav.enums";
import { CURSOR_URLS } from "./consts/map-consts.consts";

@Injectable({
	providedIn: "root",
})
export class MapService {
	private map: Map;

	private vectorLayer: VectorLayer<VectorSource<Feature>>;

	public getMap(): Map {
		return this.map;
	}

	public initMap(target: string) {
		useGeographic();
		this.map = new Map({
			target: target,

			view: new View({
				center: [0, 0],
				zoom: 2.6,
				minZoom: 2.6,
				maxZoom: 15,
				extent: [-400, -86, 400, 86],
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
				new ZoomSlider({
					target: "slider",
				}),
			],
		});
		this.vectorLayer = new VectorLayer({
			source: new VectorSource(),
		});
		this.map.addLayer(this.vectorLayer);
	}

	public addCursorToMap(mode = "") {
		const url: string = CURSOR_URLS.get(mode) ?? "";
		this.map.on("pointermove", (evt) => {
			if (!evt.dragging) {
				this.map.getTargetElement().style.cursor = `url(${url}), auto`;
			}
		});
	}

	public addFeatureToMap(feature: Feature) {
		const source = this.vectorLayer.getSource();
		source!.addFeature(feature);
	}
	public getCurrentProjection() {
		const view = this.map.getView();
		const projection = view.getProjection();
		return projection.getCode();
	}

	public removeAllFeatures(sidenavTool: SidenavTools) {
		this.map.getLayers().forEach((layer) => {
			if (layer instanceof VectorLayer) {
				const source = layer.getSource();
				if (source instanceof VectorSource) {
					const featuresToRemove = source.getFeatures().filter((feature) => {
						return feature.get("sidenavTool") === sidenavTool;
					});
					featuresToRemove.forEach((feature) => source.removeFeature(feature));
				}
			}
		});
	}
	public removeFeatureOnMouseClick(map: Map) {
		map.on("click", (event) => {
			const pixel = event.pixel;
			const vectorForRemoveFeatures: Array<Feature<Geometry>> = [];

			const forRemoveSources: Array<VectorSource> = [];
			this.map.getLayers().forEach((layer) => {
				if (layer instanceof VectorLayer) {
					const source = layer.getSource();
					if (source instanceof VectorSource) {
						const featuresToRemove = source.getFeatures().filter((feature) => {
							return feature.get("sidenavTool") === SidenavTools.Draw;
						});
						vectorForRemoveFeatures.push(...featuresToRemove);
					}

					forRemoveSources.push(source);
				}
			});

			const features = map.getFeaturesAtPixel(pixel, {
				hitTolerance: 5,
				layerFilter: (layer) =>
					layer instanceof VectorLayer &&
					vectorForRemoveFeatures.some((feature) => {
						const geometry = feature.getGeometry();
						const coordinate = map.getCoordinateFromPixel(pixel);
						if (geometry instanceof Point) {
							return geometry.getClosestPoint(coordinate) !== undefined;
						} else if (geometry instanceof LineString) {
							return geometry.intersectsCoordinate(coordinate);
						} else if (geometry instanceof Polygon) {
							return geometry.intersectsCoordinate(coordinate);
						} else if (geometry instanceof Circle) {
							return geometry.intersectsCoordinate(coordinate);
						} else {
							return false;
						}
					}),
			}) as Array<Feature<Geometry>> | undefined;

			const clickedFeature =
				features?.find((feature) => feature instanceof Feature) || null;

			if (clickedFeature) {
				const source = this.vectorLayer?.getSource();

				if (source instanceof VectorSource) {
					forRemoveSources.forEach((source) => {
						source.removeFeature(clickedFeature);
					});
				}
			}
		});
	}
}
