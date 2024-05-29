import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import VectorSource from "ol/source/Vector";
import { MeasurementPolygon } from "../../interfaces/measurement.interface";
import { Feature, Map } from "ol";
import { Draw } from "ol/interaction";
import { DrawService } from "../../../draw/draw.service";
import { getArea, getLength } from "ol/sphere";
import { Polygon } from "ol/geom";
import VectorLayer from "ol/layer/Vector";

@Component({
	selector: "app-measurement-polygon",
	templateUrl: "./polygon.component.html",
	styleUrls: ["./polygon.component.scss"],
})
export class PolygonComponent implements OnInit {
	@Input() public map: Map;
	@Input() public vectorSource: VectorSource;
	@Output() public polygonsChange = new EventEmitter<
		Array<MeasurementPolygon>
	>();

	public polygons: Array<MeasurementPolygon> = [];
	public polygonCounter = 1;
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
		this.addPolygonInteraction();
	}

	public addPolygonInteraction() {
		this.draw = new Draw({
			source: this.vectorSource,
			type: "Polygon",
		});

		this.drawService.addGlobalInteraction(this.map, this.draw);
		this.draw.set("drawType", "measurement");
		this.draw.on("drawend", (evt) => {
			const feature = evt.feature as Feature<Polygon>;
			const geometry = evt.feature.getGeometry() as Polygon;
			const area = this.calculateArea(geometry);
			const perimeter = this.calculatePerimeter(geometry);
			const polygonId = this.polygonCounter++;
			this.polygons.push({ id: polygonId, feature, area, perimeter });
			this.polygonsChange.emit(this.polygons);
		});
	}

	private calculateArea(geometry: Polygon) {
		const transformedGeometry = geometry
			.clone()
			.transform("EPSG:4326", "EPSG:3857");
		const area = getArea(transformedGeometry);
		const output = Math.round((area / 1000000) * 100) / 100 + " km\xB2";
		return output;
	}

	private calculatePerimeter(geometry: Polygon) {
		const transformedGeometry = geometry
			.clone()
			.transform("EPSG:4326", "EPSG:3857");
		const perimeter = getLength(transformedGeometry);
		const output = Math.round(perimeter * 100) / 100;
		return output;
	}
}
