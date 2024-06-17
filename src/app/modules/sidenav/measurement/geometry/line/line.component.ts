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
import { SidenavTools } from "../../../enums/sidenav.enums";
import { MeasurementMode } from "../../enums/measurement.enum";
import { CustomDraw } from "src/app/modules/shared/classes/draw-interaction.class";

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
	public draw: CustomDraw;
	public currentLength: number;
	public lastLineLength: number;
	public selectedUnit = "meters";

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
		this.map.addLayer(
			new VectorLayer({
				source: this.vectorSource,
			}),
		);
		this.addLineInteraction();
	}

	public addLineInteraction() {
		this.draw = new CustomDraw({
			source: this.vectorSource,
			type: "LineString",
		});
		this.lineCounter = this.measurementService.getLastIdMeasurement(
			MeasurementMode.Line,
		);
		this.drawService.addGlobalInteraction(this.map, this.draw);

		let lastPointCount = 0;
		this.draw.set("sidenavTool", SidenavTools.Measurement);
		this.draw.on("drawstart", (evt) => {
			this.draw.flag = true;
			const feature = evt.feature;
			const geometry = feature.getGeometry() as LineString;
			lastPointCount = geometry.getCoordinates().length;

			this.measurementService.setStyle(feature, "#1082fc");
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
			this.draw.flag = false;
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
				type: MeasurementMode.Line,
				id: lineId,
				feature,
				length: formattedLength,
			};
			this.lines.push(newLine);
			this.lastLineLength = length;
			const lastLine = this.lines.slice(-1)[0];
			this.measurementService.setLastId(MeasurementMode.Line, lineId);
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

	public formatLength(length: number) {
		if (!length) {
			return "0.00";
		}
		let formattedLength: number;
		if (this.selectedUnit === "kilometers") {
			formattedLength = Math.round((length / 1000) * 100) / 100;
		} else {
			formattedLength = Math.round(length * 100) / 100;
		}
		return formattedLength.toFixed(2);
	}
}
