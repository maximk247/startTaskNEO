import { Component } from "@angular/core";
import MapOpen from "ol/Map";
import { Overlay } from "ol";
import { Draw } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Circle, LineString, Point, Polygon } from "ol/geom";
import {
	MeasurementCircle,
	MeasurementLine,
	MeasurementPolygon,
	MeasurementPoint,
	MeasurementMode,
} from "./interfaces/measurement.interface";

import Feature from "ol/Feature";
import { MapService } from "../../map/map.service";
import { getArea, getLength } from "ol/sphere";

@Component({
	selector: "app-measurement",
	templateUrl: "./measurement.component.html",
	styleUrls: ["./measurement.component.scss"],
})
export class MeasurementComponent {
	map: MapOpen;
	vectorSource: VectorSource;
	draw: Draw;
	measureTooltips: Map<number, Overlay> = new Map();
	points: Array<MeasurementPoint> = [];
	lines: Array<MeasurementLine> = [];
	polygons: Array<MeasurementPolygon> = [];
	circles: Array<MeasurementCircle> = [];
	pointCounter = 1;
	lineCounter = 1;
	polygonCounter = 1;
	circleCounter = 1;
	mode: MeasurementMode;

	constructor(private mapService: MapService) {
		this.vectorSource = new VectorSource();

		this.map = this.mapService.getMap();

		this.map.addLayer(
			new VectorLayer({
				source: this.vectorSource,
			}),
		);
	}

	changeMode(mode: MeasurementMode) {
		switch (mode) {
			case "point":
				this.map.removeInteraction(this.draw);
				this.addPointInteraction();
				break;

			case "line":
				this.map.removeInteraction(this.draw);
				this.addLineInteraction();
				break;

			case "polygon":
				this.map.removeInteraction(this.draw);
				this.addPolygonInteraction();
				break;

			case "circle":
				this.map.removeInteraction(this.draw);
				this.addCircleInteraction();
		}
	}

	addPointInteraction() {
		this.draw = new Draw({
			source: this.vectorSource,
			type: "Point",
		});

		this.map.addInteraction(this.draw);

		this.draw.on("drawend", (evt) => {
			const feature = evt.feature as Feature<Point>;
			const geometry = evt.feature.getGeometry() as Point;
			const coordinates = geometry.getCoordinates();
			const pointId = this.pointCounter++;
			this.points.push({ id: pointId, feature });
			this.createPointTooltip(pointId, coordinates);
		});
	}

	addLineInteraction() {
		this.draw = new Draw({
			source: this.vectorSource,
			type: "LineString",
		});

		this.map.addInteraction(this.draw);

		this.draw.on("drawend", (evt) => {
			const feature = evt.feature as Feature<LineString>;
			const geometry = evt.feature.getGeometry() as LineString;
			const length = this.calculateLength(geometry);
			const lineId = this.lineCounter++;
			this.lines.push({ id: lineId, feature, length });
		});
	}
	addPolygonInteraction() {
		this.draw = new Draw({
			source: this.vectorSource,
			type: "Polygon",
		});

		this.map.addInteraction(this.draw);

		this.draw.on("drawend", (evt) => {
			const feature = evt.feature as Feature<Polygon>;
			const geometry = evt.feature.getGeometry() as Polygon;
			const area = this.calculateArea(geometry);
			const perimeter = this.calculatePerimeter(geometry);
			const polygonId = this.polygonCounter++;
			this.polygons.push({ id: polygonId, feature, area, perimeter });
		});
	}

	addCircleInteraction() {
		this.draw = new Draw({
			source: this.vectorSource,
			type: "Circle",
		});

		this.map.addInteraction(this.draw);

		this.draw.on("drawend", (evt) => {
			const feature = evt.feature as Feature<Circle>;
			const geometry = evt.feature.getGeometry() as Circle;
			const radius = this.calculateRadius(geometry);
			const circleId = this.circleCounter++;
			this.circles.push({ id: circleId, feature, radius });
		});
	}

	calculateLength(geometry: LineString) {
		const transformedGeometry = geometry
			.clone()
			.transform("EPSG:4326", "EPSG:3857");

		const length = getLength(transformedGeometry);

		const output = Math.round(length * 100) / 100 + "m";
		return output;
	}

	calculateArea(geometry: Polygon) {
		const transformedGeometry = geometry
			.clone()
			.transform("EPSG:4326", "EPSG:3857");
		const area = getArea(transformedGeometry);
		const output = Math.round((area / 1000000) * 100) / 100 + " km\xB2";
		return output;
	}

	calculatePerimeter(geometry: Polygon) {
		const transformedGeometry = geometry
			.clone()
			.transform("EPSG:4326", "EPSG:3857");
		const perimeter = getLength(transformedGeometry);
		const output = Math.round(perimeter * 100) / 100;
		return output;
	}

	calculateLineCenter(coordinates: Array<Array<number>>) {
		const midIndex = Math.floor(coordinates.length / 2);
		return coordinates[midIndex];
	}

	calculateRadius(geometry: Circle) {
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

	createPointTooltip(id: number, coordinates: Array<number>) {
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
		this.measureTooltips.set(id, measureTooltip);
	}
	removePoint(id: number) {
		const point = this.points.find((point) => point.id === id);
		if (point) {
			this.vectorSource.removeFeature(point.feature);
			this.points = this.points.filter((p) => p.id !== id);
		}

		const tooltip = this.measureTooltips.get(id);
		if (tooltip) {
			this.map.removeOverlay(tooltip);
			this.measureTooltips.delete(id);
		}
		if (this.points.length === 0) {
			this.pointCounter = 1;
		}
	}
	removeLine(id: number) {
		const line = this.lines.find((line) => line.id === id);
		if (line) {
			this.vectorSource.removeFeature(line.feature);
			this.lines = this.lines.filter((l) => l.id !== id);
		}

		const tooltip = this.measureTooltips.get(id);
		if (tooltip) {
			this.map.removeOverlay(tooltip);
			this.measureTooltips.delete(id);
		}
		if (this.lines.length === 0) {
			this.lineCounter = 1;
		}
	}

	removePolygon(id: number) {
		const polygon = this.polygons.find((polygon) => polygon.id === id);
		if (polygon) {
			this.vectorSource.removeFeature(polygon.feature);
			this.polygons = this.polygons.filter((p) => p.id !== id);
		}

		const tooltip = this.measureTooltips.get(id);
		if (tooltip) {
			this.map.removeOverlay(tooltip);
			this.measureTooltips.delete(id);
		}
		if (this.polygons.length === 0) {
			this.polygonCounter = 1;
		}
	}

	removeCircle(id: number) {
		const circle = this.circles.find((circle) => circle.id === id);
		if (circle) {
			this.vectorSource.removeFeature(circle.feature);
			this.circles = this.circles.filter((c) => c.id !== id);
		}

		const tooltip = this.measureTooltips.get(id);
		if (tooltip) {
			this.map.removeOverlay(tooltip);
			this.measureTooltips.delete(id);
		}
		if (this.circles.length === 0) {
			this.circleCounter = 1;
		}
	}
}
