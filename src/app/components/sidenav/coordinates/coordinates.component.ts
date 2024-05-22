import { Component, OnInit } from "@angular/core";
import { MapService } from "../../map/map.service";
import Map from "ol/Map";
import { Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

import { Feature } from "ol";
import { fromLonLat } from "ol/proj";

@Component({
	selector: "app-coordinates",
	templateUrl: "./coordinates.component.html",
	styleUrls: ["./coordinates.component.scss"],
})
export class CoordinatesComponent implements OnInit {
	public latitudeDegrees = 0;
	public latitudeMinutes = 0;
	public latitudeSeconds = 0;
	public longitudeDegrees = 0;
	public longitudeMinutes = 0;
	public longitudeSeconds = 0;
	private map: Map;
	public showPoint = false;
	private pointLayer: VectorLayer<VectorSource>;

	public constructor(private mapService: MapService) {}
	public ngOnInit() {
		this.map = this.mapService.getMap();
		this.pointLayer = new VectorLayer({
			source: new VectorSource(),
		});
	}

	public goToCoordinates() {
		const latitude =
			this.latitudeDegrees +
			this.latitudeMinutes / 60 +
			this.latitudeSeconds / 3600;
		const longitude =
			this.longitudeDegrees +
			this.longitudeMinutes / 60 +
			this.longitudeSeconds / 3600;

		const coordinates = [longitude, latitude];

		if (this.showPoint) {
			this.addPointToMap(coordinates);
		} else {
			this.pointLayer.getSource()!.clear(true);
		}

		this.map.getView().setCenter(coordinates);
	}
	private addPointToMap(coordinates: Array<number>) {
		const point = new Point(fromLonLat(coordinates));
		const feature = new Feature(point);
		this.pointLayer.getSource()!.clear(true);
		this.pointLayer.getSource()!.addFeature(feature);
		if (!this.map.getLayers().getArray().includes(this.pointLayer)) {
			this.map.addLayer(this.pointLayer);
		}
	}
}
