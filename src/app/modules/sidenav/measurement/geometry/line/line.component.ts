import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import VectorSource from "ol/source/Vector";
import Map from "ol/Map";
import {
	MeasurementComponentBase,
	MeasurementLine,
	MeasurementType,
} from "../../interfaces/measurement.interface";
import { Feature } from "ol";
import { LineString } from "ol/geom";
import { Draw } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import { DrawService } from "../../../draw/draw.service";
import { getLength } from "ol/sphere";
import { MeasurementService } from "../../measurement.service";
import { SidenavTools } from "../../../interfaces/sidenav.interfaces";

@Component({
	selector: "app-measurement-line",
	templateUrl: "./line.component.html",
	styleUrls: ["./line.component.scss"],
})
export class LineComponent implements OnInit, MeasurementComponentBase {
	@Input() public map: Map;
	@Input() public vectorSource: VectorSource;
	@Output() public lineChange = new EventEmitter<MeasurementType>();

	public lines: Array<MeasurementLine> = [];
	public lineCounter = 1;
	public draw: Draw;
	public currentLength: number;
	public lastLineLength: number;
	public selectedUnit = "meters";

	public constructor(
		private drawService: DrawService,
		private measurementService: MeasurementService,
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
		this.addLineInteraction();
	}

	public addLineInteraction() {
		this.draw = new Draw({
			source: this.vectorSource,
			type: "LineString",
		});
		this.lineCounter = this.measurementService.getLastIdMeasurement("line");
		this.drawService.addGlobalInteraction(this.map, this.draw);

		let lastPointCount = 0;
		this.draw.set("sidenavTool", SidenavTools.Measurement);
		this.draw.on("drawstart", (evt) => {
			const geometry = evt.feature.getGeometry() as LineString;
			lastPointCount = geometry.getCoordinates().length;

			geometry.on("change", () => {
				const currentPointCount = geometry.getCoordinates().length;
				const coordinates = geometry.getCoordinates();
				if (currentPointCount > lastPointCount) {
					this.currentLength = 0;
					lastPointCount = currentPointCount;
				} else {
					if (coordinates.length > 1) {
						const lastSegment = new LineString(coordinates.slice(-2));
						this.currentLength = this.calculateLength(lastSegment);
					} else {
						this.currentLength = 0;
					}
				}
				this.lastLineLength = this.calculateLength(geometry);
			});
		});

		this.draw.on("drawend", (evt) => {
			const feature = evt.feature as Feature<LineString>;
			feature.set("sidenavTool", "measurement");
			const geometry = evt.feature.getGeometry() as LineString;
			const length = this.calculateLength(geometry);

			const lineId = ++this.lineCounter;
			const formattedLength = this.measurementService.formatMeasurement(
				length,
				this.selectedUnit,
			);
			const newLine: MeasurementLine = {
				type: "line",
				id: lineId,
				feature,
				length: formattedLength,
			};
			this.lines.push(newLine);
			this.lastLineLength = length;
			const lastLine = this.lines.slice(-1)[0];
			this.measurementService.setLastId("line", lineId);
			this.lineChange.emit(lastLine);
		});
	}

	public resetLine() {
		this.lineChange.emit(null);
		this.lines = [];
		this.lineCounter = 0;
		this.currentLength = 0;
		this.lastLineLength = 0;
	}

	private calculateLength(geometry: LineString) {
		const transformedGeometry = geometry
			.clone()
			.transform("EPSG:4326", "EPSG:3857");

		const length = getLength(transformedGeometry);
		return length;
	}

	public removeLine(id: number) {
		const line = this.lines.find((line) => line.id === id);
		if (line) {
			this.vectorSource.removeFeature(line.feature);
			this.lines = this.lines.filter((l) => l.id !== id);
		}
		if (this.lines.length === 0) {
			this.lineCounter = 1;
		}
	}

	public formatLength(length: number) {
		if (!length) {
			return 0;
		}
		if (this.selectedUnit === "kilometers") {
			return Math.round((length / 1000) * 100) / 100;
		} else {
			return Math.round(length * 100) / 100;
		}
	}
}
