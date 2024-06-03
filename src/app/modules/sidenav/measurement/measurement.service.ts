import { Injectable } from "@angular/core";
import Map from "ol/Map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { DrawType } from "../draw/enum/draw.enum";
@Injectable({
	providedIn: "root",
})
export class MeasurementService {
	public formatMeasurement(measure: number, unit: string) {
		if (!measure) {
			return "";
		}
		if (unit === "kilometers") {
			return Math.round((measure / 1000) * 100) / 100 + " km";
		} else {
			return Math.round(measure * 100) / 100 + " м";
		}
	}

	public formatMeasurementSquare(measure: number, unit: string) {
		if (!measure) {
			return "";
		}
		if (unit === "squareKilometers") {
			return Math.round((measure / 1000000) * 100) / 100 + " km\xB2";
		} else {
			return Math.round(measure * 100) / 100 + " м\xB2";
		}
	}
}
