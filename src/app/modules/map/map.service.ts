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
import { DrawType } from "../sidenav/draw/enum/draw.enum";
import { Geometry } from "ol/geom";

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
				zoom: 0,
				minZoom: 0,
				maxZoom: 15,
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

	public addFeatureToMap(feature: Feature) {
		const source = this.vectorLayer.getSource();
		source!.addFeature(feature);
	}
	public getCurrentProjection() {
		const view = this.map.getView();
		const projection = view.getProjection();
		return projection.getCode();
	}

	public removeAllFeatures(drawType: DrawType) {
		this.map.getLayers().forEach((layer) => {
			if (layer instanceof VectorLayer) {
				const source = layer.getSource();
				if (source instanceof VectorSource) {
					const featuresToRemove = source.getFeatures().filter((feature) => {
						return feature.get("drawType") === drawType;
					});
					featuresToRemove.forEach((feature) => source.removeFeature(feature));
				}
			}
		});
	}
	public removeFeatureOnMouseClick(
		map: Map,
		vectorLayer: VectorLayer<VectorSource>,
	) {
		map.on("click", (event) => {
			const pixel = event.pixel;
			const features = map.getFeaturesAtPixel(pixel, {
				hitTolerance: 5,
				layerFilter: (layer) => layer === vectorLayer,
			}) as Array<Feature<Geometry>> | undefined;

			const clickedFeature =
				features?.find((feature) => feature instanceof Feature) || null;

			if (clickedFeature) {
				const source = vectorLayer.getSource();
				if (source instanceof VectorSource) {
					source.removeFeature(clickedFeature);
				}
			}
		});
	}
}