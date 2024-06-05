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
import { HeightService } from "src/app/modules/shared/height.service";
import { style } from "@angular/animations";
import { Style } from "ol/style";
import { Coordinate, toStringHDMS } from "ol/coordinate";
import { MeasurementService } from "../../measurement.service";
@Component({
	selector: "app-measurement-point",
	templateUrl: "./point.component.html",
	styleUrls: ["./point.component.scss"],
})
export class PointComponent implements OnInit {
	@Input() public map: MapOpen;
	@Input() public vectorSource: VectorSource;
	@Output() public pointsChange = new EventEmitter<any>();

	public showCoordinates: boolean;
	public showHeight: boolean;

	public spatialReferences: Array<SpatialReference> = [];

	private currentProjection: SpatialReference;
	private newProjection: SpatialReference;
	private draw: Draw;

	public height: any;

	private measureTooltips: Map<number, Overlay> = new Map();
	public points: Array<MeasurementPoint> = [];
	public pointCounter = 1;
	public latitudeDegrees: string;
	public longitudeDegrees: string;

	public constructor(
		private spatialReferenceService: SpatialReferenceService,
		private drawService: DrawService,
		private translocoService: TranslocoService,
		private heightService: HeightService,
		private measurementService: MeasurementService,
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

	private getHeight(coordinates: any): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.heightService.postCoordinates(coordinates).subscribe(
				(data: any) => {
					this.height = data.results[0].elevation;
					resolve();
				},
				(error) => {
					console.log(error);
					reject(error);
				},
			);
		});
	}

	public addPointInteraction() {
		this.draw = new Draw({
			source: this.vectorSource,
			type: "Point",
		});
		this.drawService.addGlobalInteraction(this.map, this.draw);
		this.pointCounter = this.measurementService.getLastIdMeasurement("point") ;
		this.draw.set("drawType", DrawType.Measurement);
		this.draw.on("drawend", async (evt) => {
			const feature = evt.feature as Feature<Point>;
			feature.set("drawType", "measurement");
			const geometry = evt.feature.getGeometry() as Point;

			const coordinates = this.calculateCoordinates(geometry);
			const transformedCoordinates = this.transformCoordinates(coordinates);

			const pointId = ++this.pointCounter;

			if (this.showHeight) {
				await this.getHeight(coordinates);
				transformedCoordinates.push(this.height);
			}

			if (this.showCoordinates) {
				this.createPointTooltip(pointId, transformedCoordinates);
			} else {
				feature.setStyle(
					new Style({
						image: undefined,
					}),
				);
			}
			const fullCoordinates = transformedCoordinates.map(
				(coordinate: string, index: number) => {
					coordinate = coordinate.toString();
					if (index === 0) {
						coordinate += " " + `(${this.latitudeDegrees})`;
					} else if (index === 1) {
						coordinate += " " + `(${this.longitudeDegrees})`;
					} else if (index === 2) {
						coordinate += " м";
					}
					return coordinate;
				},
			);
			this.points?.push({
				type: 'point',
				id: pointId,
				feature,
				coordinates: fullCoordinates,
			});

			const obj = {
				points: this.points,
				vectorSource: this.vectorSource,
				overlay: this.measureTooltips,
			};
			this.measurementService.setLastId("point", pointId);
			this.pointsChange.emit(obj);
		});
	}

	public resetPoint() {
		this.pointsChange.emit({
			points: null,
			vectorSource: this.vectorSource,
			measureTooltips: this.measureTooltips,
		});
		this.points = [];
		this.pointCounter = 0;
	}

	private calculateCoordinates(geometry: Point) {
		const coordinates = geometry.getCoordinates();
		const degreesCoordinates = toStringHDMS(coordinates)
			.split(" ")
			.filter((coordinate) => {
				if (coordinate === "N" || coordinate === "E" || coordinate === "S") {
					return false;
				}
				return true;
			});

		this.latitudeDegrees = degreesCoordinates.slice(0, 3).join(" ");
		this.longitudeDegrees = degreesCoordinates.slice(3, 6).join(" ");
		return coordinates;
	}

	private transformCoordinates(coordinates: Array<number>) {
		const proj4 = (proj4x as any).default;
		const transformedCoordinates = proj4(
			this.currentProjection.name,
			this.newProjection.name,
			coordinates,
		);
		for (let i = 0; i < transformedCoordinates.length; i++) {
			transformedCoordinates[i] = Number(transformedCoordinates[i].toFixed(5));
		}
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
			const firstProjection = this.spatialReferences[0];
			this.currentProjection = firstProjection;
			this.newProjection = firstProjection;
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

		const [x, y, z = 0] = coordinates;

		tooltipElement.innerHTML = `
        <div class="centered-text">Широта (Y): ${y} (${this.latitudeDegrees})</div>
        <div class="centered-text">Долгота(X): ${x} (${this.longitudeDegrees})</div>
        ${(z || z === 0) && this.showHeight ? `<div class="centered-text">Высота(Z): ${z} м</div>` : ""}
    `;

		const measureTooltip = new Overlay({
			element: tooltipElement,
			offset: [0, -25],
			positioning: "bottom-center",
		});

		const proj4 = (proj4x as any).default;
		const clonedCoordinates = JSON.parse(JSON.stringify(coordinates)); // proj4 менял исходные координаты, а он (proj4) не учитывал Z координаты
		const transformedCoordinatesToDegrees = proj4(
			this.newProjection.name,
			"EPSG:4326",
			clonedCoordinates,
		);

		measureTooltip.setPosition(transformedCoordinatesToDegrees);

		this.map.addOverlay(measureTooltip);
		this.measureTooltips.set(id, measureTooltip);
	}
	public removePoint(id: number) {
		const point = this.points?.find((point) => point.id === id);
		if (point) {
			this.vectorSource.removeFeature(point.feature);
			this.points = this.points.filter((p) => p.id !== id);
		}
		const tooltip = this.measureTooltips.get(id);
		if (tooltip) {
			this.map.removeOverlay(tooltip);
			this.measureTooltips.delete(id);
		}
	}
}
