import { Component, OnInit } from "@angular/core";
import { MapService } from "../../map/map.service";
import Map from "ol/Map";
import { Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { SpatialReference } from "../../shared/interfaces/spatial-reference.interfaces";
import * as proj4x from "proj4";
import { ProjectionType } from "../draw/modules/draw-options/enum/draw-options.enum";
import { SidenavTools } from "../interfaces/sidenav.interface";
import { Coordinate } from "ol/coordinate";
import { Icon, Style } from "ol/style";

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
	public x = 0;
	public y = 0;
	private map: Map;
	public showPoint = false;
	private pointLayer: VectorLayer<VectorSource>;
	public spatialReferences: Array<SpatialReference> = [];

	public newProjection: SpatialReference;

	public constructor(private mapService: MapService) {}
	public ngOnInit() {
		this.map = this.mapService.getMap();
		this.pointLayer = new VectorLayer({
			source: new VectorSource(),
		});
		this.map.addLayer(this.pointLayer);
		this.mapService.addCursorToMap()
	}

	public onSelectedReferenceChange(selectedReference: SpatialReference): void {
		this.newProjection = selectedReference;
	}

	public goToCoordinates() {
		const proj4 = (proj4x as any).default;
		let transformCoordinates;
		if (this.newProjection.type === ProjectionType.Degree) {
			const latitude =
				Number(this.latitudeDegrees) +
				Number(this.latitudeMinutes) / 60 +
				Number(this.latitudeSeconds) / 3600;
			const longitude =
				Number(this.longitudeDegrees) +
				Number(this.longitudeMinutes) / 60 +
				Number(this.longitudeSeconds) / 3600;

			const coordinates = [longitude, latitude];
			transformCoordinates = proj4(this.newProjection.name).forward(
				coordinates,
			);
		} else if (this.newProjection.type === ProjectionType.Metric) {
			const x = Number(this.x);
			const y = Number(this.y);

			transformCoordinates = proj4(this.newProjection.name, "EPSG:4326", [
				x,
				y,
			]);
		}

		if (this.showPoint) {
			this.addPointToMap(transformCoordinates);
		}
		this.map.getView().setCenter(transformCoordinates);
	}
	public addPointToMap(coordinates: Coordinate) {
		const point = new Point(coordinates);
		const feature = new Feature(point);
		feature.set("sidenavTool", SidenavTools.Coordinates);
		const iconStyle = new Icon({
			src: "assets/images/marker-big.png",
		});
		const pointStyle = new Style({
			image: iconStyle,
		});
		feature.setStyle(pointStyle);
		this.pointLayer.getSource()?.addFeature(feature);
	}

	public onChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const selectedRef = this.spatialReferences.find(
			(ref) => ref.name === target.value,
		);
		if (selectedRef) {
			this.newProjection = selectedRef;
		}
	}

	public removeAllCoordinates() {
		this.mapService.removeAllFeatures(SidenavTools.Coordinates);
	}
}
