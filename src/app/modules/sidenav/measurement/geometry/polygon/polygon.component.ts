import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import VectorSource from "ol/source/Vector";
import {
	MeasurementComponentBase,
	MeasurementPolygon,
	MeasurementType,
} from "../../interfaces/measurement.interface";
import { Feature, Map } from "ol";
import { DrawService } from "../../../draw/draw.service";
import { getArea, getLength } from "ol/sphere";
import { Polygon } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import { MeasurementService } from "../../measurement.service";
import { SidenavTools } from "../../../enums/sidenav.enums";
import { MeasurementMode } from "../../enums/measurement.enum";
import { CustomDraw } from "src/app/modules/shared/classes/draw-interaction.class";

@Component({
	selector: "app-measurement-polygon",
	templateUrl: "./polygon.component.html",
	styleUrls: ["./polygon.component.scss"],
})
export class PolygonComponent implements OnInit, MeasurementComponentBase {
	@Input() public map: Map;
	@Input() public vectorSource: VectorSource;
	@Output() public polygonChange = new EventEmitter<MeasurementType>();

	public polygons: Array<MeasurementPolygon> = [];
	public polygonCounter = 1;
	public draw: CustomDraw;

	public selectedAreaUnit = "squareMeters";
	public selectedUnit = "meters";

	public totalArea: number;
	public totalPerimeter: number;

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
		this.addPolygonInteraction();
	}

	public addPolygonInteraction() {
		this.draw = new CustomDraw({
			source: this.vectorSource,
			type: "Polygon",
		});

		this.drawService.addGlobalInteraction(this.map, this.draw);
		this.polygonCounter = this.measurementService.getLastIdMeasurement(
			MeasurementMode.Polygon,
		);

		this.draw.set("sidenavTool", SidenavTools.Measurement);
		this.draw.on("drawstart", (evt) => {
			this.draw.flag = true;
			const feature = evt.feature;
			const geometry = feature.getGeometry() as Polygon;
			this.measurementService.setStyle(feature, "#1082fc", "#7fa9d9");

			geometry.on("change", () => {
				this.totalArea = this.calculateArea(geometry);
				this.totalPerimeter = this.calculatePerimeter(geometry);
			});
		});
		this.draw.on("drawend", (evt) => {
			const feature = evt.feature as Feature<Polygon>;
			feature.set("sidenavTool", "measurement");
			this.draw.flag = false;

			const formattedArea = this.measurementService.formatMeasurementSquare(
				this.totalArea,
				this.selectedAreaUnit,
			);
			const formattedPerimeter = this.measurementService.formatMeasurement(
				this.totalPerimeter,
				this.selectedUnit,
			);

			const polygonId = ++this.polygonCounter;
			this.polygons.push({
				type: MeasurementMode.Polygon,
				id: polygonId,
				feature,
				area: formattedArea,
				perimeter: formattedPerimeter,
			});
			const lastPolygon = this.polygons.slice(-1)[0];
			this.measurementService.setLastId(MeasurementMode.Polygon, polygonId);
			this.polygonChange.emit(lastPolygon);
		});
	}

	public resetPolygon() {
		this.polygonCounter = 0;
		this.polygons = [];
		this.polygonChange.emit(null);
		this.totalArea = 0;
		this.totalPerimeter = 0;
	}

	private calculateArea(geometry: Polygon) {
		const transformedGeometry = geometry
			.clone()
			.transform("EPSG:4326", "EPSG:3857");
		const area = getArea(transformedGeometry);
		return area;
	}

	private calculatePerimeter(geometry: Polygon) {
		const transformedGeometry = geometry
			.clone()
			.transform("EPSG:4326", "EPSG:3857");
		const perimeter = getLength(transformedGeometry);
		return perimeter;
	}

	public formatPerimeter(perimeter: number) {
		if (!perimeter) {
			return 0;
		}
		if (this.selectedUnit === "kilometers") {
			return Math.round((perimeter / 1000) * 100) / 100;
		} else {
			return Math.round(perimeter * 100) / 100;
		}
	}

	public formatArea(area: number) {
		if (!area) {
			return "0.00";
		}
		let formattedLength: number;
		if (this.selectedAreaUnit === "squareKilometers") {
			formattedLength = Math.round((area / 1000000) * 100) / 100;
		} else {
			formattedLength = Math.round(area * 100) / 100;
		}
		return formattedLength.toFixed(2);
	}
}
