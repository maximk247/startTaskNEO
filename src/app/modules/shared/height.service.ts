import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
	providedIn: "root",
})
export class HeightService {
	private apiUrl =
		"https://api.open-elevation.com/api/v1/lookup?locations=";

	public constructor(private http: HttpClient) {}

	public postCoordinates(coordinates: Array<number>) {
		const obj = {
			latitude: coordinates[0],
			longitude: coordinates[1],
		};
		this.apiUrl = `https://api.open-elevation.com/api/v1/lookup?locations=${obj.latitude},${obj.longitude}`
		return this.http.get(this.apiUrl);
	}
}
