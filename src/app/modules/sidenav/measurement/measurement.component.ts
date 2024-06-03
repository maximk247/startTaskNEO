import { Component, OnInit, ViewChild } from "@angular/core";
import MapOpen from "ol/Map";
import { Overlay } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { MeasurementMode } from "./interfaces/measurement.interface";
import { MapService } from "../../map/map.service";
import { DrawService } from "../draw/draw.service";
import { PointComponent } from "./geometry/point/point.component";
import { LineComponent } from "./geometry/line/line.component";
import { CircleComponent } from "./geometry/circle/circle.component";
import { PolygonComponent } from "./geometry/polygon/polygon.component";


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
	public allMeasurements: any = [];
	@ViewChild(PointComponent) public pointComponent: PointComponent;
	@ViewChild(LineComponent) public lineComponent: LineComponent;
	@ViewChild(PolygonComponent) public polygonComponent: PolygonComponent;
	@ViewChild(CircleComponent) public circleComponent: CircleComponent;
	public constructor(
		private mapService: MapService,
		private drawService: DrawService,
	
	) {}

	public ngOnInit() {
		this.vectorSource = new VectorSource();

		this.map = this.mapService.getMap();

		this.map.addLayer(
			new VectorLayer({
				source: this.vectorSource,
			}),
		);
		const interactions = this.map.getInteractions().getArray();
		interactions.forEach((interaction) => {
			if (interaction.get("drawType")) {
				this.drawService.removeGlobalInteraction(this.map, interaction);
			}
		});
	}


	public onPointsChange(obj: any) {
		const lastPoint = obj.points.slice(-1)[0];
		if (lastPoint) {
			this.allMeasurements.push({
				...lastPoint,
				type: "point",
				measureTooltips: obj.measureTooltips,
			});
		}

		this.vectorSource = obj.vectorSource;
		this.lastId.point = lastPoint.id;
	}
	public onLinesChange(obj: any) {
		const lastLine = obj.lines.slice(-1)[0];
		if (lastLine) {
			this.allMeasurements.push({ ...lastLine, type: "line" });
		}
		this.vectorSource = obj.vectorSource;
		this.lastId.line = lastLine.id;
	}

	public onPolygonsChange(obj: any) {
		const lastPolygon = obj.polygons.slice(-1)[0];
		if (lastPolygon) {
			this.allMeasurements.push({ ...lastPolygon, type: "polygon" });
		}
		this.vectorSource = obj.vectorSource;
		this.lastId.polygon = lastPolygon.id;
	}

	public onCirclesChange(obj: any) {
		const lastCircle = obj.circles.slice(-1)[0];
		if (lastCircle) {
			this.allMeasurements.push({ ...lastCircle, type: "circle" });
		}
		this.vectorSource = obj.vectorSource;
		this.lastId.circle = lastCircle.id;
	}

	public onModeChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const mode = target.value as MeasurementMode;

		setTimeout(() => {
			const componentsMap = {
				point: this.pointComponent,
				line: this.lineComponent,
				polygon: this.polygonComponent,
				circle: this.circleComponent,
			};
			const component = componentsMap[mode];

			const lastId = this.lastId[mode];

			(component as any)[`${mode}Counter`] = lastId + 1;
		}, 0);
	}

	public removeMeasurement(measurement: any) {
		this.allMeasurements = this.allMeasurements.filter(
			(m: {
				id: number;
				type: string;
				measureTooltips?: Map<number, Overlay>;
			}) => {
				const shouldKeep = !(
					m.id === measurement.id && m.type === measurement.type
				);

				if (!shouldKeep && m.measureTooltips) {
					const tooltip = m.measureTooltips.get(m.id);
					if (tooltip) {
						this.map.removeOverlay(tooltip);
						m.measureTooltips.delete(m.id);
					}
				}
				this.vectorSource.removeFeature(measurement.feature);
				return shouldKeep;
			},
		);
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
	}

	private checkAndResetMeasurement(
		type: string,
		component: any,
		resetMethod: string,
	) {
		const measurementsLeft = this.allMeasurements.filter(
			(m: { type: string }) => m.type === type,
		);

		if (measurementsLeft.length === 0 && component) {
			component[resetMethod]();
		}
	}

	public removeAllMeasurement() {
		this.allMeasurements.forEach((measurement: any) => {
			this.removeMeasurement(measurement)
		})
	}
}
