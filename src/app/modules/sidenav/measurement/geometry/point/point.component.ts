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
import { TranslocoService } from "@ngneat/transloco";
import { DrawType } from "../../../draw/enum/draw.enum";
import { HeightService } from "src/app/modules/shared/heigt.service";
@Component({
	selector: "app-measurement-point",
	templateUrl: "./point.component.html",
	styleUrls: ["./point.component.scss"],
})
export class PointComponent implements OnInit {
	@Input() public map: MapOpen;
	@Input() public vectorSource: VectorSource;
	@Output() public pointsChange = new EventEmitter<any>();

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
		private translocoService: TranslocoService,
		private heightService: HeightService,
	) {}

	public ngOnInit(): void {
		const interactions = this.map.getInteractions().getArray();
		interactions.forEach((interaction) => {
			if (interaction.get("drawType") === DrawType.Measurement) {
				this.drawService.removeGlobalInteraction(this.map, interaction);
			}
		});
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
				const errorMessage = this.translocoService.translate(
					"errorDueToSpecialReference",
				);
				console.error(errorMessage, error);
			},
		);
	}

	private getHeight(coordinates: any): void {
		this.heightService.postCoordinates(coordinates).subscribe(
			(data) => {
				console.log(data);
			},
			(error) => {
				console.log(error);
			},
		)
	}

	public addPointInteraction() {
		this.draw = new Draw({
			source: this.vectorSource,
			type: "Point",
		});
		const proj4 = (proj4x as any).default;
		this.drawService.addGlobalInteraction(this.map, this.draw);
		this.draw.set("drawType", DrawType.Measurement);
		this.draw.on("drawend", (evt) => {
			const feature = evt.feature as Feature<Point>;
			feature.set("drawType", "measurement");
			const geometry = evt.feature.getGeometry() as Point;
			const coordinates = this.calculateCoordinates(geometry);
			const transformedCoordinates = this.transformCoordinates(coordinates);
			const coordinatesForHeight = proj4('Web Mercator',coordinates)
			const pointId = this.pointCounter++;
			const height = this.getHeight(coordinatesForHeight)
			console.log(height)
			this.points?.push({
				id: pointId,
				feature,
				coordinates: transformedCoordinates,
			});
			this.createPointTooltip(pointId, transformedCoordinates);
			const obj = {
				points: this.points,
				vectorSource: this.vectorSource,
				measureTooltips: this.measureTooltips,
			};
			this.pointsChange.emit(obj);
		});
	}

	public resetPoint() {
		this.pointsChange.emit({
			points: [],
			vectorSource: this.vectorSource,
			measureTooltips: this.measureTooltips,
		});
		this.points = [];
		this.pointCounter = 1;
	}

	private calculateCoordinates(geometry: Point) {
		const coordinates = geometry.getCoordinates();
		return coordinates;
	}

	private transformCoordinates(coordinates: Array<number>) {
		const proj4 = (proj4x as any).default;
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
		const point = this.points?.find((point) => point.id === id);
		if (point) {
			this.vectorSource.removeFeature(point.feature);
			this.points = this.points!.filter((p) => p.id !== id);
		}
		const tooltip = this.measureTooltips.get(id);
		if (tooltip) {
			this.map.removeOverlay(tooltip);
			this.measureTooltips.delete(id);
		}
	}
}
