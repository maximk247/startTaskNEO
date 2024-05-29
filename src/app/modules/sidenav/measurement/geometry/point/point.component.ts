import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SpatialReference } from "src/app/modules/shared/interfaces/spatial-reference.interfaces";
import { SpatialReferenceService } from "src/app/modules/shared/spatial-reference.service";
import * as proj4x from "proj4";
import { register } from "ol/proj/proj4";

import { DrawService } from "../../../draw/draw.service";
import MapOpen from "ol/Map";
import { Feature, Overlay } from "ol";
import { Draw } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { MeasurementPoint } from "../../interfaces/measurement.interface";
import { Point } from "ol/geom";
@Component({
	selector: "app-measurement-point",
	templateUrl: "./point.component.html",
	styleUrls: ["./point.component.scss"],
})
export class PointComponent implements OnInit {
	@Input() public map: MapOpen;
	@Input() public vectorSource: VectorSource;
	@Output() public pointsChange = new EventEmitter<Array<MeasurementPoint>>();

	public spatialReferences: Array<SpatialReference> = [];

	private currentProjection: SpatialReference;
	private newProjection: SpatialReference;
	private draw: Draw;


	private measureTooltips: Map<number, Overlay> = new Map();
	public points: Array<MeasurementPoint> = [];
	public pointCounter = 1;

	public constructor(
		private spatialReferenceService: SpatialReferenceService,
		private drawService: DrawService,
	) {}

	public ngOnInit(): void {
		this.getSpatialReferences();

		this.map.addLayer(
			new VectorLayer({
				source: this.vectorSource,
			}),
		);
		this.addPointInteraction();
	}

	private getSpatialReferences(): void {
		this.spatialReferenceService.getSpatialReferences().subscribe(
			(data: Array<SpatialReference>) => {
				this.spatialReferences = data;
				this.registerProjections();
				this.setDefaultProjection();
			},

			(error) => {
				console.error("Ошибка при загрузке пространственных ссылок:", error);
			},
		);
	}

	public addPointInteraction() {
		this.draw = new Draw({
			source: this.vectorSource,
			type: "Point",
		});

		this.drawService.addGlobalInteraction(this.map, this.draw);
		this.draw.set("drawType", "measurement");
		this.draw.on("drawend", (evt) => {
			const feature = evt.feature as Feature<Point>;
			const geometry = evt.feature.getGeometry() as Point;
			const coordinates = this.calculateCoordinates(geometry);
			const transformedCoordinates = this.transformCoordinates(coordinates);
			const pointId = this.pointCounter++;
			this.points.push({
				id: pointId,
				feature,
				coordinates: transformedCoordinates,
			});
			this.createPointTooltip(pointId, transformedCoordinates);
      this.pointsChange.emit(this.points);
		});
	}

	private calculateCoordinates(geometry: Point) {
		const coordinates = geometry.getCoordinates();
		return coordinates;
	}

	private transformCoordinates(coordinates: Array<number>) {
		const proj4 = (proj4x as any).default;
		console.log(this.currentProjection.name, this.newProjection.name);
		const transformedCoordinates = proj4(
			this.currentProjection.name,
			this.newProjection.name,
			coordinates,
		);
		return transformedCoordinates;
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
			this.currentProjection = this.spatialReferences[0];
			this.newProjection = this.currentProjection;
		}
	}

	public onChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		const selectedRef = this.spatialReferences.find(
			(ref) => ref.id === +target.value,
		);
		if (selectedRef) {
			this.newProjection = selectedRef;
		}
	}

	public createPointTooltip(id: number, coordinates: Array<number>) {
		const tooltipElement = document.createElement("div");
		tooltipElement.innerHTML =
			"Point: " + coordinates[0] + ", " + coordinates[1];
		console.log(tooltipElement);
		const measureTooltip = new Overlay({
			element: tooltipElement,
			offset: [0, -25],
			positioning: "bottom-center",
		});

		const proj4 = (proj4x as any).default;
		const transformedCoordinatesToDegrees = proj4(
			this.newProjection.name,
			"EPSG:4326",
			coordinates,
		);

		measureTooltip.setPosition(transformedCoordinatesToDegrees);

		this.map.addOverlay(measureTooltip);
		this.measureTooltips.set(id, measureTooltip);
	}
	public removePoint(id: number) {
		const point = this.points.find((point) => point.id === id);
		if (point) {
			this.vectorSource.removeFeature(point.feature);
			this.points = this.points.filter((p) => p.id !== id);
		}

		const tooltip = this.measureTooltips.get(id);
		if (tooltip) {
			this.map.removeOverlay(tooltip);
			this.measureTooltips.delete(id);
		}
		if (this.points.length === 0) {
			this.pointCounter = 1;
		}
	}
}
