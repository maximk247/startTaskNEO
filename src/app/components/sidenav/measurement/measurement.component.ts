import { Component } from "@angular/core";
import MapOpen from "ol/Map";
import { Overlay } from "ol";
import { Draw } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { LineString, Point } from "ol/geom";
import Feature from "ol/Feature";
import { MapService } from "../../map/map.service";

@Component({
	selector: "app-measurement",
	templateUrl: "./measurement.component.html",
	styleUrls: ["./measurement.component.scss"],
})
export class MeasurementComponent {
	map: MapOpen;
	vectorSource: VectorSource;
	draw: Draw;
	measureTooltips: Map<Feature<LineString | Point>, Overlay> = new Map();
	mode: "point" | "line";

	constructor(private mapService: MapService) {
		this.vectorSource = new VectorSource();

		this.map = this.mapService.getMap();

		this.map.addLayer(
			new VectorLayer({
				source: this.vectorSource,
			}),
		);

		this.addDrawInteraction();
	}

	changeMode(mode: "point" | "line") {
		if (mode === "point") {
			this.map.removeInteraction(this.draw);
			this.addPointInteraction();
		} else if (mode === "line") {
			this.map.removeInteraction(this.draw);
			this.addDrawInteraction();
		}
	}

	addDrawInteraction() {
		this.draw = new Draw({
			source: this.vectorSource,
			type: "LineString",
		});

		this.map.addInteraction(this.draw);

		this.draw.on("drawend", (evt) => {
			const geometry = evt.feature.getGeometry() as LineString;
			const length = this.calculateLength(geometry.getCoordinates());
			const lineCenter = this.calculateLineCenter(geometry.getCoordinates());
			this.createMeasureTooltip(geometry, length, lineCenter);
		});
	}

	addPointInteraction() {
		this.draw = new Draw({
			source: this.vectorSource,
			type: "Point",
		});

		this.map.addInteraction(this.draw);

		this.draw.on("drawend", (evt) => {
			const geometry = evt.feature.getGeometry() as Point;
			const coordinates = geometry.getCoordinates();
			this.createPointTooltip(coordinates);
		});
	}

	calculateLength(coordinates: Array<Array<number>>) {
		let length = 0;
		for (let i = 0; i < coordinates.length - 1; i++) {
			length += Math.sqrt(
				Math.pow(coordinates[i + 1][0] - coordinates[i][0], 2) +
					Math.pow(coordinates[i + 1][1] - coordinates[i][1], 2),
			);
		}
		return length;
	}

	calculateLineCenter(coordinates: Array<Array<number>>) {
		const midIndex = Math.floor(coordinates.length / 2);
		return coordinates[midIndex];
	}

	createMeasureTooltip(
		geometry: LineString,
		length: number,
		position: Array<number>,
	) {
		const tooltipElement = document.createElement("div");
		tooltipElement.innerHTML = length.toFixed(2) + " meters";

		const measureTooltip = new Overlay({
			element: tooltipElement,
			offset: [0, -15],
			positioning: "bottom-center",
		});

		measureTooltip.setPosition(position);
		this.map.addOverlay(measureTooltip);
		this.measureTooltips.set(new Feature({ geometry }), measureTooltip);
	}

	createPointTooltip(coordinates: Array<number>) {
		const tooltipElement = document.createElement("div");
		tooltipElement.innerHTML =
			"Point: " + coordinates[0] + ", " + coordinates[1];

		const measureTooltip = new Overlay({
			element: tooltipElement,
			offset: [0, -15],
			positioning: "bottom-center",
		});

		measureTooltip.setPosition(coordinates);
		this.map.addOverlay(measureTooltip);
		this.measureTooltips.set(
			new Feature({ geometry: new Point(coordinates) }),
			measureTooltip,
		);
	}
}
