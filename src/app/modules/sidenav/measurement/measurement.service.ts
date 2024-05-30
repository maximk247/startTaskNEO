import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class MeasurementService {
	public formatMeasurement(measure: number, unit: string): string {
		if (!measure) {
			return "";
		}
		if (unit === "kilometers") {
			return Math.round((measure / 1000) * 100) / 100 + " km";
		} else {
			return Math.round(measure * 100) / 100 + " м";
		}
	}

	public formatMeasurementSquare(measure: number, unit: string): string {
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
