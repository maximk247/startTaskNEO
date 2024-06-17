import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ElevationArray } from "./interfaces/elevation.interfaces";
import { Coordinate } from "ol/coordinate";

@Injectable({
	providedIn: "root",
})
export class ElevationService {
	private apiUrl = "https://api.open-elevation.com/api/v1/lookup?locations=";

	public constructor(private http: HttpClient) {}

	public getCoordinates(coordinates: Coordinate) {
		const obj = {
			latitude: coordinates[0],
			longitude: coordinates[1],
		};
		this.apiUrl = `https://api.open-elevation.com/api/v1/lookup?locations=${obj.latitude},${obj.longitude}`;
		return this.http.get<ElevationArray>(this.apiUrl);
	}
}
