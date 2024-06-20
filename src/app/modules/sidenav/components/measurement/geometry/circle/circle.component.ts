import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
	MeasurementCircle,
	MeasurementComponentBase,
	MeasurementType,
} from "../../interfaces/measurement.interface";
import VectorSource from "ol/source/Vector";
import Map from "ol/Map";
import { Draw } from "ol/interaction";
import { DrawService } from "../../../draw/draw.service";
import { Feature } from "ol";
import { Circle, LineString } from "ol/geom";
import { getLength } from "ol/sphere";
import VectorLayer from "ol/layer/Vector";
import { MeasurementService } from "../../measurement.service";
import { SidenavTools } from "../../../../enums/sidenav.enums";
import { MeasurementMode } from "../../enums/measurement.enum";
import { CustomDraw } from "src/app/modules/shared/classes/draw-interaction.class";

@Component({
	selector: "app-measurement-circle",
	templateUrl: "./circle.component.html",
	styleUrls: ["./circle.component.scss"],
})
export class CircleComponent implements OnInit, MeasurementComponentBase {
	@Input() public map: Map;
	@Input() public vectorSource: VectorSource;
	@Output() public circleChange = new EventEmitter<MeasurementType>();

	public circles: Array<MeasurementCircle> = [];
	public circleCounter = 1;
	public draw: CustomDraw;

	public selectedUnit = "meters";
	public currentRadius: number;
	public totalRadius: number;

	public constructor(
		private drawService: DrawService,
		public measurementService: MeasurementService,
	) {}

	public ngOnInit(): void {
		const interactions = this.map.getInteractions().getArray();
		interactions.forEach((interaction) => {
			if (interaction.get("sidenavTool") === SidenavTools.Measurement) {
				this.drawService.removeGlobalInteraction(this.map, interaction);
			}
		});
		this.map.addLayer(new VectorLayer({ source: this.vectorSource }));
		this.addCircleInteraction();
	}

	public addCircleInteraction() {
		this.draw = new CustomDraw({
			source: this.vectorSource,
			type: "Circle",
		});
		this.circleCounter = this.measurementService.getLastIdMeasurement(
			MeasurementMode.Circle,
		);
		this.drawService.addGlobalInteraction(this.map, this.draw);

		this.draw.set("sidenavTool", SidenavTools.Measurement);
		this.draw.on("drawstart", (evt) => {
			this.draw.flag = true;
			const feature = evt.feature;
			const geometry = feature.getGeometry() as Circle;
			this.measurementService.setStyle(feature, "#1082fc", "#7fa9d9");

			geometry.on("change", () => {
				const centerCoords = geometry.getCenter();
				const radiusCoords = [
					centerCoords,
					[centerCoords[0] + geometry.getRadius(), centerCoords[1]],
				];
				const radiusLineString = new LineString(radiusCoords);
				const newRadius = this.calculateRadius(radiusLineString);
				this.totalRadius = newRadius;
			});
		});

		this.draw.on("drawend", (evt) => {
			this.draw.flag = false;
			const feature = evt.feature as Feature<Circle>;
			feature.set("sidenavTool", "measurement");
			const formattedRadius = this.measurementService.formatMeasurement(
				this.totalRadius,
				this.selectedUnit,
			);

			const circleId = ++this.circleCounter;
			this.circles.push({
				type: MeasurementMode.Circle,
				id: circleId,
				feature,
				radius: formattedRadius,
			});
			const lastCircle = this.circles.slice(-1)[0];
			this.measurementService.setLastId(MeasurementMode.Circle, circleId);
			this.circleChange.emit(lastCircle);
		});
	}

	public resetCircle() {
		this.circleCounter = 0;
		this.circleChange.emit(null);
		this.totalRadius = 0;
		this.currentRadius = 0;
	}

	private calculateRadius(geometry: LineString) {
		const transformedGeometry = geometry
			.clone()
			.transform("EPSG:4326", "EPSG:3857");
		const radius = getLength(transformedGeometry);
		return radius;
	}

	public formatRadius(radius: number) {
		if (!radius) {
			return "0.00";
		}
		let formattedLength: number;
		if (this.selectedUnit === "kilometers") {
			formattedLength = Math.round((radius / 1000) * 100) / 100;
		} else {
			formattedLength = Math.round(radius * 100) / 100;
		}

		return formattedLength.toFixed(2);
	}
}
