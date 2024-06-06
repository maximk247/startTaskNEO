import { Component, OnInit } from "@angular/core";
import { MapService } from "../../map/map.service";
import Map from "ol/Map";
import { Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { SpatialReferenceService } from "../../shared/spatial-reference.service";
import { SpatialReference } from "../../shared/interfaces/spatial-reference.interfaces";
import { TranslocoService } from "@ngneat/transloco";
import * as proj4x from "proj4";
import { register } from "ol/proj/proj4";
import { ProjectionType } from "../draw/modules/draw-options/enum/draw-options.enum";
import { map } from "rxjs";
import { DrawType } from "../draw/enum/draw.enum";

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

	private defaultDegreeProjection: SpatialReference;
	public newProjection: SpatialReference;

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
				this.registerProjections();
				this.setDefaultProjection();
			},

			(error) => {
				const errorMessage = this.translocoService.translate(
					"errorDueToSpecialReference",
				);
				console.error(errorMessage, error);
			},
		);
	}

	private registerProjections(): void {
		const proj4 = (proj4x as any).default;
		this.spatialReferences.forEach((ref) => {
			proj4.defs(ref.name, ref.definition);
		});
		register(proj4);
	}

	private setDefaultProjection(): void {
		if (this.spatialReferences.length > 0) {
			const [firstProjection] = this.spatialReferences;
			this.defaultDegreeProjection = firstProjection;
			this.newProjection = firstProjection;
		}
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
			transformCoordinates = proj4(this.defaultDegreeProjection.name).forward(
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
	public addPointToMap(coordinates: Array<number>) {
		const point = new Point(coordinates);
		const feature = new Feature(point);
		feature.set('drawType', 'coordinates')
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
		this.mapService.removeAllFeatures(DrawType.Coordinates)
	}
}
