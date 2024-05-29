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
@Component({
	selector: "app-measurement-circle",
	templateUrl: "./circle.component.html",
	styleUrls: ["./circle.component.scss"],
})
export class CircleComponent implements OnInit {
	@Input() public map: Map;
	@Input() public vectorSource: VectorSource;
	@Output() public circlesChange = new EventEmitter<Array<MeasurementCircle>>();

	public circles: Array<MeasurementCircle> = [];
	public circleCounter = 1;
	public draw: Draw;

	public constructor(private drawService: DrawService) {}

	public ngOnInit(): void {
		const interactions = this.map.getInteractions().getArray();
		interactions.forEach((interaction) => {
			if (interaction.get("drawType") === "measurement") {
				this.drawService.removeGlobalInteraction(this.map, interaction);
			}
		});
		this.map.addLayer(
			new VectorLayer({
				source: this.vectorSource,
			}),
		);
		this.addCircleInteraction();
	}

	public addCircleInteraction() {
		this.draw = new Draw({
			source: this.vectorSource,
			type: "Circle",
		});

		this.drawService.addGlobalInteraction(this.map, this.draw);
		this.draw.set("drawType", "measurement");
		this.draw.on("drawend", (evt) => {
			const feature = evt.feature as Feature<Circle>;
			const geometry = evt.feature.getGeometry() as Circle;
			const radius = this.calculateRadius(geometry);
			const circleId = this.circleCounter++;
			this.circles.push({ id: circleId, feature, radius });
			this.circlesChange.emit(this.circles);
		});
	}

	private calculateRadius(geometry: Circle) {
		const centerCoords = geometry.getCenter();

		const circleBoundary = new LineString([
			centerCoords,
			[centerCoords[0] + geometry.getRadius(), centerCoords[1]],
		]);

		const transformedCircleBoundary = circleBoundary
			.clone()
			.transform("EPSG:4326", "EPSG:3857");
		const radius = getLength(transformedCircleBoundary);

		const output = Math.round(radius * 100) / 100 + "m";
		return output;
	}
}
