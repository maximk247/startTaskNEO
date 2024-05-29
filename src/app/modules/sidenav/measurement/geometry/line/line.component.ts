import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import VectorSource from "ol/source/Vector";
import Map from "ol/Map";
import { MeasurementLine } from "../../interfaces/measurement.interface";
import { Feature } from "ol";
import { LineString } from "ol/geom";
import { Draw } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import { DrawService } from "../../../draw/draw.service";
import { getLength } from "ol/sphere";

@Component({
	selector: "app-measurement-line",
	templateUrl: "./line.component.html",
	styleUrls: ["./line.component.scss"],
})
export class LineComponent implements OnInit {
	@Input() public map: Map;
	@Input() public vectorSource: VectorSource;
	@Output() public linesChange = new EventEmitter<Array<MeasurementLine>>();

	public lines: Array<MeasurementLine> = [];
	public lineCounter = 1;
	public draw: Draw;
	public currentLength = "";
	public lastLineLength = "";

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
		this.addLineInteraction();
	}

	public addLineInteraction() {
		this.draw = new Draw({
			source: this.vectorSource,
			type: "LineString",
		});

		this.drawService.addGlobalInteraction(this.map, this.draw);
		this.draw.set("drawType", "measurement");

		let lastPointCount = 0;

		this.draw.on("drawstart", (evt) => {
			const geometry = evt.feature.getGeometry() as LineString;
			lastPointCount = geometry.getCoordinates().length;

			geometry.on("change", () => {
				const currentPointCount = geometry.getCoordinates().length;
				const coordinates = geometry.getCoordinates();
				if (currentPointCount > lastPointCount) {
					this.currentLength = ""; 
					lastPointCount = currentPointCount;
				} else {
					if (coordinates.length > 1) {
						const lastSegment = new LineString(coordinates.slice(-2));
						this.currentLength = this.calculateLength(lastSegment);
					} else {
						this.currentLength = "0m";
					}
				}
				this.lastLineLength = this.calculateLength(geometry); 
			});
		});

		this.draw.on("drawend", (evt) => {
			const feature = evt.feature as Feature<LineString>;
			const geometry = evt.feature.getGeometry() as LineString;
			const length = this.calculateLength(geometry);
			const lineId = this.lineCounter++;
			const newLine: MeasurementLine = { id: lineId, feature, length };
			this.lines.push(newLine);
			this.currentLength = length;
			this.lastLineLength = length;
			this.linesChange.emit(this.lines);
		});
	}

	private calculateLength(geometry: LineString) {
		const transformedGeometry = geometry
			.clone()
			.transform("EPSG:4326", "EPSG:3857");

		const length = getLength(transformedGeometry);

		const output = Math.round(length * 100) / 100 + "m";
		return output;
	}
}
