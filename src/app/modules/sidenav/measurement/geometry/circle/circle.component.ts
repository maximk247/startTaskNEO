import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MeasurementCircle } from "../../interfaces/measurement.interface";
import VectorSource from "ol/source/Vector";
import Map from "ol/Map";
import { Draw } from "ol/interaction";
import { DrawService } from "../../../draw/draw.service";
import { Feature } from "ol";
import { Circle, LineString } from "ol/geom";
import { getLength } from "ol/sphere";
import VectorLayer from "ol/layer/Vector";
import { DrawType } from "../../../draw/enum/draw.enum";
import { MeasurementService } from "../../measurement.service";

@Component({
	selector: "app-measurement-circle",
	templateUrl: "./circle.component.html",
	styleUrls: ["./circle.component.scss"],
})
export class CircleComponent implements OnInit {
	@Input() public map: Map;
	@Input() public vectorSource: VectorSource;
	@Output() public circlesChange = new EventEmitter<any>();

	public circles: Array<MeasurementCircle> = [];
	public circleCounter = 1;
	public draw: Draw;

	public selectedUnit = "meters";
	public currentRadius: number;
	public totalRadius: number;

	public constructor(
		private drawService: DrawService,
		private measurementService: MeasurementService,
	) {}

	public ngOnInit(): void {
		const interactions = this.map.getInteractions().getArray();
		interactions.forEach((interaction) => {
			if (interaction.get("drawType") === DrawType.Measurement) {
				this.drawService.removeGlobalInteraction(this.map, interaction);
			}
		});
		this.map.addLayer(new VectorLayer({ source: this.vectorSource }));
		this.addCircleInteraction();
	}

	public addCircleInteraction() {
		this.draw = new Draw({
			source: this.vectorSource,
			type: "Circle",
		});

		this.drawService.addGlobalInteraction(this.map, this.draw);
		this.draw.set("drawType", "measurement");

		let lastRadius = 0;

		this.draw.on("drawstart", (evt) => {
			const geometry = evt.feature.getGeometry() as Circle;
			lastRadius = geometry.getRadius();

			geometry.on("change", () => {
				const centerCoords = geometry.getCenter();
				const radiusCoords = [
					centerCoords,
					[centerCoords[0] + geometry.getRadius(), centerCoords[1]],
				];
				const radiusLineString = new LineString(radiusCoords);
				const newRadius = this.calculateRadius(radiusLineString);
				if (newRadius !== lastRadius) {
					this.currentRadius = newRadius;
					lastRadius = newRadius;
				}
				this.totalRadius = this.currentRadius;
			});
		});

		this.draw.on("drawend", (evt) => {
			const feature = evt.feature as Feature<Circle>;
			const geometry = evt.feature.getGeometry() as Circle;
			const radiusCoords = [
				geometry.getCenter(),
				[
					geometry.getCenter()[0] + geometry.getRadius(),
					geometry.getCenter()[1],
				],
			];
			const radiusLineString = new LineString(radiusCoords);
			const radius = this.calculateRadius(radiusLineString);
			const formattedRadius = this.measurementService.formatMeasurement(
				radius,
				this.selectedUnit,
			);
			const circleId = this.circleCounter++;
			this.circles.push({ id: circleId, feature, radius: formattedRadius });
			this.totalRadius = radius;
			const obj = {
				circles: this.circles,
				vectorSource: this.vectorSource,}
			this.circlesChange.emit(obj);
		});
	}

	public resetLine() {
		this.circleCounter = 1;
		this.circlesChange.emit({
			circles: null,
			vectorSource: this.vectorSource,
		});
	}

	private calculateRadius(geometry: LineString) {
		const transformedGeometry = geometry
			.clone()
			.transform("EPSG:4326", "EPSG:3857");
		const radius = getLength(transformedGeometry);
		return radius;
	}

	public removeCircle(id: number) {
		const circle = this.circles.find((circle) => circle.id === id);
		if (circle) {
			this.vectorSource.removeFeature(circle.feature);
			this.circles = this.circles.filter((c) => c.id !== id);
		}

		if (this.circles.length === 0) {
			this.circleCounter = 1;
		}
	}

	public formatRadius(radius: number): string {
		if (!radius) {
			return "";
		}
		if (this.selectedUnit === "kilometers") {
			return Math.round((radius / 1000) * 100) / 100 + " km";
		} else {
			return Math.round(radius * 100) / 100 + " м";
		}
	}
}
