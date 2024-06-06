import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import VectorSource from "ol/source/Vector";
import {
	MeasurementComponentBase,
	MeasurementPolygon,
	MeasurementType,
} from "../../interfaces/measurement.interface";
import { Feature, Map } from "ol";
import { Draw } from "ol/interaction";
import { DrawService } from "../../../draw/draw.service";
import { getArea, getLength } from "ol/sphere";
import { Polygon } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import { MeasurementService } from "../../measurement.service";
import { SidenavTools } from "../../../interfaces/sidenav.interfaces";

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
	public draw: Draw;

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
		this.draw = new Draw({
			source: this.vectorSource,
			type: "Polygon",
		});

		this.drawService.addGlobalInteraction(this.map, this.draw);
		this.polygonCounter =
			this.measurementService.getLastIdMeasurement("polygon");

		this.draw.set("sidenavTool", SidenavTools.Measurement);
		this.draw.on("drawstart", (evt) => {
			const geometry = evt.feature.getGeometry() as Polygon;

			geometry.on("change", () => {
				this.totalArea = this.calculateArea(geometry);
				this.totalPerimeter = this.calculatePerimeter(geometry);
			});
		});
		this.draw.on("drawend", (evt) => {
			const feature = evt.feature as Feature<Polygon>;
			feature.set("sidenavTool", "measurement");
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
				type: "polygon",
				id: polygonId,
				feature,
				area: formattedArea,
				perimeter: formattedPerimeter,
			});
			const lastPolygon = this.polygons.slice(-1)[0];
			this.measurementService.setLastId("polygon", polygonId);
			this.polygonChange.emit(lastPolygon);
		});
	}

	public resetPolygon() {
		this.polygonCounter = 0;
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

	public removePolygon(id: number) {
		const polygon = this.polygons.find((polygon) => polygon.id === id);
		if (polygon) {
			this.vectorSource.removeFeature(polygon.feature);
			this.polygons = this.polygons.filter((p) => p.id !== id);
		}

		if (this.polygons.length === 0) {
			this.polygonCounter = 1;
		}
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
			return 0;
		}
		if (this.selectedAreaUnit === "squareKilometers") {
			return Math.round((area / 1000000) * 100) / 100;
		} else {
			return Math.round(area * 100) / 100;
		}
	}
}
