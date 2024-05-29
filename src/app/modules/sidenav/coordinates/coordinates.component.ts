import { Component, OnInit } from "@angular/core";
import { MapService } from "../../map/map.service";
import Map from "ol/Map";
import { Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

import { Feature } from "ol";
import { fromLonLat } from "ol/proj";

import { SpatialReferenceService } from "../../shared/spatial-reference.service";
import { SpatialReference } from "../../shared/interfaces/spatial-reference.interfaces";
import { TranslocoService } from "@ngneat/transloco";

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
	public spatialReferences: Array<SpatialReference> = [];
	public selectedSpatialReference: SpatialReference | undefined;
	public constructor(
		private mapService: MapService,
		private spatialReferenceService: SpatialReferenceService,
		private translocoService: TranslocoService,
	) {}
	public ngOnInit() {
		this.map = this.mapService.getMap();
		this.pointLayer = new VectorLayer({
			source: new VectorSource(),
		});
		this.map.addLayer(this.pointLayer);
		this.getSpatialReferences();
	}
	private getSpatialReferences(): void {
		this.spatialReferenceService.getSpatialReferences().subscribe(
			(data: Array<SpatialReference>) => {
				this.spatialReferences = data;
				console.log(this.spatialReferences);
			},
			(error) => {
				const errorMessage = this.translocoService.translate(
					"errorDueToSpecialReference",
				);
				console.error(errorMessage, error);
			},
		);
	}

	public goToCoordinates() {
		const latitude =
			Number(this.latitudeDegrees) +
			Number(this.latitudeMinutes) / 60 +
			Number(this.latitudeSeconds) / 3600;
		const longitude =
			Number(this.longitudeDegrees) +
			Number(this.longitudeMinutes) / 60 +
			Number(this.longitudeSeconds) / 3600;

		const coordinates = [longitude, latitude];
		const lonlat = fromLonLat(coordinates, "EPSG:4326");
		if (this.showPoint) {
			this.addPointToMap(lonlat);
		} else {
			this.pointLayer.getSource()!.clear(true);
		}

		this.map.getView().setCenter(lonlat);
	}
	public addPointToMap(coordinates: Array<number>) {
		const point = new Point(coordinates);
		const feature = new Feature(point);
		this.pointLayer.getSource()!.addFeature(feature);
		if (!this.map.getLayers().getArray().includes(this.pointLayer)) {
			this.map.addLayer(this.pointLayer);
		}
	}
}
