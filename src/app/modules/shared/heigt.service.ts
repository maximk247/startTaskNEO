// http://gs-yung.neostk.com/neoportal/api/height-service/height
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";



@Injectable({
	providedIn: "root",
})
export class HeightService {
	private apiUrl =
		"http://gs-yung.neostk.com/neoportal/api/height-service/height";

	public constructor(private http: HttpClient) {}

	public postCoordinates(coordinates: any) {
        const obj = {latitude: coordinates[0], longitude: coordinates[1], srs: "3857"}
		return this.http.post(this.apiUrl, obj);
	}
}
