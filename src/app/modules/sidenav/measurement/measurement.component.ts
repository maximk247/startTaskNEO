import { Component, OnInit, ViewChild } from "@angular/core";
import MapOpen from "ol/Map";
import { Overlay } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {
	MeasurementPoint,
	MeasurementLine,
	MeasurementPolygon,
	MeasurementCircle,
	MeasurementType,
	MeasurementMode,
	PointsChangeEvent,
} from "./interfaces/measurement.interface";
import { MapService } from "../../map/map.service";
import { DrawService } from "../draw/draw.service";
import { PointComponent } from "./geometry/point/point.component";
import { LineComponent } from "./geometry/line/line.component";
import { CircleComponent } from "./geometry/circle/circle.component";
import { PolygonComponent } from "./geometry/polygon/polygon.component";
import { MeasurementService } from "./measurement.service";
import { DrawType } from "../draw/enum/draw.enum";

@Component({
	selector: "app-measurement",
	templateUrl: "./measurement.component.html",
	styleUrls: ["./measurement.component.scss"],
})
export class MeasurementComponent implements OnInit {
	public map: MapOpen;
	public vectorSource: VectorSource;
	public mode: MeasurementMode = "point";
	public lastId = {
		point: 0,
		line: 0,
		polygon: 0,
		circle: 0,
	};

	public allMeasurements: Array<MeasurementType> = [];
	@ViewChild(PointComponent) public pointComponent: PointComponent;
	@ViewChild(LineComponent) public lineComponent: LineComponent;
	@ViewChild(PolygonComponent) public polygonComponent: PolygonComponent;
	@ViewChild(CircleComponent) public circleComponent: CircleComponent;

	public constructor(
		private mapService: MapService,
		private drawService: DrawService,
		private measurementService: MeasurementService,
	) {}

	public ngOnInit() {
		this.vectorSource = new VectorSource();

		this.map = this.mapService.getMap();

		this.map.addLayer(
			new VectorLayer({
				source: this.vectorSource,
			}),
		);
		const savedMeasurements = this.measurementService.getMeasurements();

		if (savedMeasurements.length > 0) {
			this.allMeasurements = savedMeasurements;
			this.loadMeasurements();
		}
		const interactions = this.map.getInteractions().getArray();
		interactions.forEach((interaction) => {
			if (interaction.get("drawType")) {
				this.drawService.removeGlobalInteraction(this.map, interaction);
			}
		});
	}

	public onPointsChange(obj: PointsChangeEvent) {
		if (obj.points) {
			const lastPoint = obj.points.slice(-1)[0];
			this.allMeasurements.push({
				...lastPoint,
				type: "point",
				measureTooltips: obj.overlay,
			});
			this.vectorSource = obj.vectorSource;
			this.saveMeasurements();
		}
	}
	public onLinesChange(obj: any) {
		if (obj.lines) {
			const lastLine = obj.lines.slice(-1)[0];
			this.allMeasurements.push({ ...lastLine, type: "line" });
			this.vectorSource = obj.vectorSource;
			this.saveMeasurements();
		}
	}

	public onPolygonsChange(obj: any) {
		if (obj.polygons) {
			const lastPolygon = obj.polygons.slice(-1)[0];
			this.allMeasurements.push({ ...lastPolygon, type: "polygon" });
			this.vectorSource = obj.vectorSource;
			this.saveMeasurements();
		}
	}

	public onCirclesChange(obj: any) {
		if (obj.circles) {
			const lastCircle = obj.circles.slice(-1)[0];
			this.allMeasurements.push({ ...lastCircle, type: "circle" });
			this.vectorSource = obj.vectorSource;
			this.saveMeasurements();
		}
	}

	public removeMeasurement(measurement: MeasurementType) {
		this.allMeasurements = this.allMeasurements.filter((m) => {
			const shouldKeep = !(
				m.id === measurement.id && m.type === measurement.type
			);
			if (!shouldKeep && "measureTooltips" in m) {
				const tooltip = m.measureTooltips?.get(m.id);
				if (tooltip) {
					this.map.removeOverlay(tooltip);
					m.measureTooltips?.delete(m.id);
				}
			}
			this.vectorSource.removeFeature(measurement.feature);
			return shouldKeep;
		});

		this.checkAndResetMeasurement("point", this.pointComponent, "resetPoint");
		this.checkAndResetMeasurement(
			"polygon",
			this.polygonComponent,
			"resetPolygon",
		);
		this.checkAndResetMeasurement("line", this.lineComponent, "resetLine");
		this.checkAndResetMeasurement(
			"circle",
			this.circleComponent,
			"resetCircle",
		);
		this.saveMeasurements();
	}
	private checkAndResetMeasurement(
		type: string,
		component: any,
		resetMethod: string,
	) {
		const measurementsLeft = this.allMeasurements.filter(
			(m) => m.type === type,
		);

		if (measurementsLeft.length === 0 && component) {
			component[resetMethod]();
		}
	}

	public removeAllMeasurement() {
		this.allMeasurements.forEach((measurement) => {
			this.removeMeasurement(measurement);
		});
		this.mapService.removeAllFeatures(DrawType.Measurement);
		this.measurementService.clearMeasurements();
	}
	private saveMeasurements() {
		this.measurementService.setMeasurements(this.allMeasurements);
	}

	private loadMeasurements() {
		this.allMeasurements.forEach((measurement) => {
			if (measurement.feature) {
				this.vectorSource.addFeature(measurement.feature);
			}
			if (measurement.measureTooltips) {
				measurement.measureTooltips.forEach((overlay: Overlay) => {
					this.map.addOverlay(overlay);
				});
			}
		});
		this.lastId = this.measurementService.getLastId();
	}
	public isPoint(
		measurement: MeasurementType,
	): measurement is MeasurementPoint {
		return measurement.type === "point";
	}

	public isLine(measurement: MeasurementType): measurement is MeasurementLine {
		return measurement.type === "line";
	}

	public isPolygon(
		measurement: MeasurementType,
	): measurement is MeasurementPolygon {
		return measurement.type === "polygon";
	}

	public isCircle(
		measurement: MeasurementType,
	): measurement is MeasurementCircle {
		return measurement.type === "circle";
	}
}