import { Component, OnInit, ViewChild } from "@angular/core";
import MapOpen from "ol/Map";

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {
	MeasurementPoint,
	MeasurementLine,
	MeasurementPolygon,
	MeasurementCircle,
	MeasurementType,
} from "./interfaces/measurement.interface";
import { MapService } from "../../map/map.service";
import { DrawService } from "../draw/draw.service";
import { PointComponent } from "./geometry/point/point.component";
import { LineComponent } from "./geometry/line/line.component";
import { CircleComponent } from "./geometry/circle/circle.component";
import { PolygonComponent } from "./geometry/polygon/polygon.component";
import { MeasurementService } from "./measurement.service";
import { SidenavTools } from "../interfaces/sidenav.interface";
import { MeasurementMode } from "./enums/measurement.enum";
import Style, { StyleLike } from "ol/style/Style";
import { Feature } from "ol";
import { Icon } from "ol/style";

@Component({
	selector: "app-measurement",
	templateUrl: "./measurement.component.html",
	styleUrls: ["./measurement.component.scss"],
})
export class MeasurementComponent implements OnInit {
	public map: MapOpen;
	public vectorSource: VectorSource;
	public mode = MeasurementMode.Point;
	public lastId = {
		point: 0,
		line: 0,
		polygon: 0,
		circle: 0,
	};

	public text: string;

	public allMeasurements: Array<MeasurementType> = [];
	public originalStyles = new Map<MeasurementType, StyleLike>();

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
		this.mapService.addCursorToMap("Measurement");
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
			if (interaction.get("sidenavTool")) {
				this.drawService.removeGlobalInteraction(this.map, interaction);
			}
		});
		this.setTextBasedOnMode(this.mode);
	}

	private setTextBasedOnMode(mode: MeasurementMode) {
		switch (mode) {
			case MeasurementMode.Point:
				this.text = "Укажите точку на карте.";
				break;
			case MeasurementMode.Line:
				this.text =
					"Укажите узлы измеряемой линии на карте. Завершите измерение, дважды щелкнув по карте левой кнопкой мыши.";
				break;
			case MeasurementMode.Circle:
				this.text =
					"Укажите точку на карте. Завершите измерение, дважды щелкнув по карте левой кнопкой мыши.";
				break;

			case MeasurementMode.Polygon:
				this.text =
					"Укажите узлы измеряемой фигуры на карте. Завершите измерение, дважды щелкнув по карте левой кнопкой мыши.";
				break;
		}
	}

	public onModeChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const value = target.value;
		this.setTextBasedOnMode(value as MeasurementMode);
	}

	public onPointChange(point: MeasurementType) {
		if (point) {
			this.allMeasurements.push(point);
			this.saveMeasurements();
		}
	}
	public onLineChange(line: MeasurementType) {
		if (line) {
			this.allMeasurements.push(line);
			this.saveMeasurements();
		}
	}

	public onPolygonChange(polygon: MeasurementType) {
		if (polygon) {
			this.allMeasurements.push(polygon);
			this.saveMeasurements();
		}
	}

	public onCircleChange(circle: MeasurementType) {
		if (circle) {
			this.allMeasurements.push(circle);
			this.saveMeasurements();
		}
	}

	public removeMeasurement(measurement: MeasurementType) {
		this.allMeasurements = this.allMeasurements.filter((m) => {
			const shouldKeep = !(
				m?.id === measurement?.id && m?.type === measurement?.type
			);
			this.vectorSource.removeFeature(measurement!.feature);
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

	public showMeasurement(measurement: MeasurementType) {
		this.allMeasurements.forEach((m) => {
			if (m?.feature) {
				const originalStyle = m.feature.getStyle() as Style;
				if (!this.originalStyles.has(m)) {
					this.originalStyles.set(m, originalStyle!);
				}
				if (m === measurement && measurement) {
					if (measurement.type === MeasurementMode.Point) {
						const newStyle = originalStyle.clone();
						newStyle.setImage(
							new Icon({
								src: "assets/images/marker-big-green.png",
							}),
						);
						m.feature.setStyle(newStyle);
					} else {
						this.measurementService.setStyle(
							measurement.feature,
							"#1aa522",
							"#86ca85",
						);
					}
				} else {
					if (this.originalStyles.has(m)) {
						m.feature.setStyle(this.originalStyles.get(m));
					}
				}
			}
		});
	}
	private checkAndResetMeasurement(
		type: string,
		component: any,
		resetMethod: string,
	) {
		const measurementsLeft = this.allMeasurements.filter(
			(m) => m?.type === type,
		);

		if (measurementsLeft.length === 0 && component) {
			component[resetMethod]();
		}
	}

	public removeAllMeasurement() {
		this.allMeasurements.forEach((measurement) => {
			this.removeMeasurement(measurement);
		});
		this.mapService.removeAllFeatures(SidenavTools.Measurement);
		this.measurementService.clearMeasurements();
	}
	private saveMeasurements() {
		this.measurementService.setMeasurements(this.allMeasurements);
	}

	private loadMeasurements() {
		this.allMeasurements.forEach((measurement) => {
			if (measurement?.feature) {
				this.vectorSource.addFeature(measurement.feature);
			}
		});
		this.lastId = this.measurementService.getLastId();
	}
	public isPoint(
		measurement: MeasurementType,
	): measurement is MeasurementPoint {
		return measurement?.type === MeasurementMode.Point;
	}

	public isLine(measurement: MeasurementType): measurement is MeasurementLine {
		return measurement?.type === MeasurementMode.Line;
	}

	public isPolygon(
		measurement: MeasurementType,
	): measurement is MeasurementPolygon {
		return measurement?.type === MeasurementMode.Polygon;
	}

	public isCircle(
		measurement: MeasurementType,
	): measurement is MeasurementCircle {
		return measurement?.type === MeasurementMode.Circle;
	}
}
