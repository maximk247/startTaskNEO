import { Injectable } from "@angular/core";
import { MeasurementType } from "./interfaces/measurement.interface";
import { MeasurementMode } from "./enums/measurement.enums";

@Injectable({
	providedIn: "root",
})
export class MeasurementService {
	private measurements: Array<MeasurementType> = [];
	private lastId: Record<MeasurementMode, number> = {
		point: 0,
		line: 0,
		polygon: 0,
		circle: 0,
	};

	public getMeasurements() {
		return this.measurements;
	}

	public setMeasurements(measurements: Array<MeasurementType>) {
		this.measurements = measurements;
	}

	public getLastIdMeasurement(mode: MeasurementMode) {
		return this.lastId[mode];
	}

	public getLastId() {
		return this.lastId;
	}

	public setLastId(mode: MeasurementMode, id: number) {
		this.lastId[mode] = id;
	}

	public clearMeasurements() {
		this.measurements = [];
		this.lastId = {
			point: 0,
			line: 0,
			polygon: 0,
			circle: 0,
		};
	}

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
