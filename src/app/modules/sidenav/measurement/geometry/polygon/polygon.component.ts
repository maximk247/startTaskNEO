import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import VectorSource from "ol/source/Vector";
import { MeasurementPolygon } from "../../interfaces/measurement.interface";
import { Feature, Map } from "ol";
import { Draw } from "ol/interaction";
import { DrawService } from "../../../draw/draw.service";
import { getArea, getLength } from "ol/sphere";
import { Polygon } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import { DrawType } from "../../../draw/enum/draw.enum";
import { MeasurementService } from "../../measurement.service";

@Component({
	selector: "app-measurement-polygon",
	templateUrl: "./polygon.component.html",
	styleUrls: ["./polygon.component.scss"],
})
export class PolygonComponent implements OnInit {
	@Input() public map: Map;
	@Input() public vectorSource: VectorSource;
	@Output() public polygonsChange = new EventEmitter<any>();

	public polygons: Array<MeasurementPolygon> = [];
	public polygonCounter = 1;
	public draw: Draw;

	public selectedAreaUnit = "squareMeters";
	public selectedUnit = "meters";

	public currentSegmentArea: number;
	public totalArea: number;
	public currentSegmentPerimeter: number;
	public totalPerimeter: number;

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
		this.draw.set("drawType", "measurement");

		let lastPointCount = 0;
		this.draw.on("drawstart", (evt) => {
			const geometry = evt.feature.getGeometry() as Polygon;
			lastPointCount = geometry.getCoordinates()[0].length;

			geometry.on("change", () => {
				const currentPointCount = geometry.getCoordinates()[0].length;
				const coordinates = geometry.getCoordinates()[0];
				if (currentPointCount > lastPointCount) {
					this.currentSegmentArea = 0;
					this.currentSegmentPerimeter = 0;
					lastPointCount = currentPointCount;
				} else {
					if (coordinates.length > 2) {
						const lastSegment = new Polygon([coordinates.slice(-3)]);
						this.currentSegmentArea = this.calculateArea(lastSegment);
						this.currentSegmentPerimeter = this.calculatePerimeter(lastSegment);
					} else {
						this.currentSegmentArea = 0;
						this.currentSegmentPerimeter = 0;
					}
				}
				this.totalArea = this.calculateArea(geometry);
				this.totalPerimeter = this.calculatePerimeter(geometry);
			});
		});
		this.draw.on("drawend", (evt) => {
			const feature = evt.feature as Feature<Polygon>;
			const geometry = evt.feature.getGeometry() as Polygon;
			const area = this.calculateArea(geometry);
			const perimeter = this.calculatePerimeter(geometry);
			const formattedArea = this.measurementService.formatMeasurementSquare(
				area,
				this.selectedAreaUnit,
			);
			const formattedPerimeter = this.measurementService.formatMeasurement(
				perimeter,
				this.selectedUnit,
			);
			const polygonId = this.polygonCounter++;
			this.polygons.push({
				id: polygonId,
				feature,
				area: formattedArea,
				perimeter: formattedPerimeter,
			});
			this.totalArea = area;
			this.totalPerimeter = perimeter;
			const obj = { polygons: this.polygons, vectorSource: this.vectorSource };
			this.polygonsChange.emit(obj);
		});
	}

	public resetPolygon() {
		this.polygonCounter = 1;
		this.polygonsChange.emit({
			polygons: null,
			vectorSource: this.vectorSource,
		});
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

	public formatPerimeter(perimeter: number): string {
		if (!perimeter) {
			return "";
		}
		if (this.selectedUnit === "kilometers") {
			return Math.round((perimeter / 1000) * 100) / 100 + " km";
		} else {
			return Math.round(perimeter * 100) / 100 + " м";
		}
	}

	public formatArea(area: number): string {
		if (!area) {
			return "";
		}
		if (this.selectedAreaUnit === "squareKilometers") {
			return Math.round((area / 1000000) * 100) / 100 + " km\xB2";
		} else {
			return Math.round(area * 100) / 100 + " м\xB2";
		}
	}
}
