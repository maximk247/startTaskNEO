import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SpatialReference } from "src/app/modules/shared/interfaces/spatial-reference.interfaces";
import * as proj4x from "proj4";
import { DrawService } from "../../../draw/draw.service";
import MapOpen from "ol/Map";
import { Feature, MapBrowserEvent, Overlay } from "ol";
import { Draw } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {
	MeasurementComponentBase,
	MeasurementPoint,
	MeasurementType,
} from "../../interfaces/measurement.interface";
import { Point } from "ol/geom";
import { ElevationService } from "src/app/modules/shared/elevation.service";
import { Fill, Icon, Stroke, Style, Text } from "ol/style";
import { Coordinate, toStringHDMS } from "ol/coordinate";
import { MeasurementService } from "../../measurement.service";
import { ElevationArray } from "src/app/modules/shared/interfaces/elevation.interfaces";
import { SidenavTools } from "../../../../enums/sidenav.enums";
import { MeasurementMode } from "../../enums/measurement.enum";
import { CustomDraw } from "src/app/modules/shared/classes/draw-interaction.class";

@Component({
	selector: "app-measurement-point",
	templateUrl: "./point.component.html",
	styleUrls: ["./point.component.scss"],
})
export class PointComponent implements OnInit, MeasurementComponentBase {
	@Input() public map: MapOpen;
	@Input() public vectorSource: VectorSource;
	@Output() public pointChange = new EventEmitter<MeasurementType>();

	public showCoordinates = true;
	public showElevation = true;

	public spatialReferences: Array<SpatialReference> = [];

	private newProjection: SpatialReference;
	private draw: CustomDraw;

	public elevation: number;

	public point: Array<MeasurementPoint> = [];
	public pointCounter = 1;
	public latitudeDegrees: string;
	public longitudeDegrees: string;

	public constructor(
		private drawService: DrawService,
		private elevationService: ElevationService,
		public measurementService: MeasurementService,
	) {}

	public ngOnInit(): void {
		const interactions = this.map.getInteractions().getArray();
		interactions.forEach((interaction) => {
			if (interaction.get("sidenavTool") === SidenavTools.Measurement) {
				this.drawService.removeGlobalInteraction(this.map, interaction);
			}
		});

		this.map.addLayer(
			new VectorLayer({
				source: this.vectorSource,
			}),
		);
		this.addPointInteraction();
	}

	public onSelectedReferenceChange(selectedReference: SpatialReference): void {
		this.newProjection = selectedReference;
	}

	private getElevation(coordinates: Coordinate): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.elevationService.getCoordinates(coordinates).subscribe(
				(data: ElevationArray) => {
					this.elevation = data.results[0].elevation;
					resolve();
				},
				(error) => {
					reject(error);
				},
			);
		});
	}

	public addPointInteraction() {
		this.draw = new CustomDraw({
			source: this.vectorSource,
			type: "Point",
		});

		this.drawService.addGlobalInteraction(this.map, this.draw);
		this.pointCounter = this.measurementService.getLastIdMeasurement(
			MeasurementMode.Point,
		);
		this.draw.set("sidenavTool", SidenavTools.Measurement);

		this.draw.on("drawend", async (evt) => {
			const feature = evt.feature as Feature<Point>;
			feature.set("sidenavTool", "measurement");
			const geometry = evt.feature.getGeometry() as Point;

			const coordinates = this.calculateCoordinates(geometry);
			const transformedCoordinates = this.transformCoordinates(coordinates);

			const pointId = ++this.pointCounter;

			if (this.showElevation) {
				await this.getElevation(coordinates);
				transformedCoordinates.push(this.elevation);
			}

			if (this.showCoordinates) {
				this.createPointTooltip(transformedCoordinates, feature);
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
			this.point?.push({
				type: MeasurementMode.Point,
				id: pointId,
				feature,
				coordinates: fullCoordinates,
			});

			const lastPoint = this.point.slice(-1)[0];
			this.measurementService.setLastId(MeasurementMode.Point, pointId);
			this.pointChange.emit(lastPoint);
		});
	}

	public resetPoint() {
		this.pointChange.emit(null);
		this.point = [];
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

		const longitudeSign = coordinates[0] < 0 ? "-" : "";
		const latitudeSign = coordinates[1] < 0 ? "-" : "";
		this.longitudeDegrees =
			longitudeSign + degreesCoordinates.slice(0, 3).join(" ");
		this.latitudeDegrees =
			latitudeSign + degreesCoordinates.slice(3, 6).join(" ");
		return coordinates;
	}

	private transformCoordinates(coordinates: Coordinate) {
		const proj4 = (proj4x as any).default;

		const longitudeSign = coordinates[0] < 0 ? "-" : "";
		const latitudeSign = coordinates[1] < 0 ? "-" : "";
		const transformedCoordinates = proj4(this.newProjection.name, coordinates);
		for (let i = 0; i < transformedCoordinates.length; i++) {
			transformedCoordinates[i] = Number(transformedCoordinates[i]).toFixed(5);

			if (i === 0 && longitudeSign) {
				transformedCoordinates[i] = "-" + Math.abs(transformedCoordinates[i]);
			} else if (i === 1 && latitudeSign) {
				transformedCoordinates[i] = "-" + Math.abs(transformedCoordinates[i]);
			}

		}

		return transformedCoordinates;
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

	public createPointTooltip(coordinates: Coordinate, feature: Feature<Point>) {
		const [x, y, z = 0] = coordinates;
		const textStyle = new Text({
			text: `Широта (Y): ${y} (${this.latitudeDegrees}),\n Долгота (X): ${x} (${this.longitudeDegrees}),\n ${this.showElevation ? `Высота (Z): ${z} м` : ""}`,
			font: "12px Calibri,sans-serif",
			fill: new Fill({
				color: "#fff",
			}),
			offsetX: 0,
			offsetY: 20,
			stroke: new Stroke({
				color: "#000",
				width: 3,
			}),
			padding: [2, 2, 2, 2],
		});

		const iconStyle = new Icon({
			src: "assets/images/marker-big.png",
		});

		const pointStyle = new Style({
			text: textStyle,
			image: iconStyle,
		});

		feature.setStyle(pointStyle);
	}
}
