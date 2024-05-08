import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class SpatialReferenceService {
	private apiUrl =
		"http://gs-yung.neostk.com/neoportal/api/gisp-api/SpatialReferences?mapId=1&api-version=2";

	constructor(private http: HttpClient) {}

	getSpatialReferences(): Observable<any> {
		return this.http.get<any>(this.apiUrl);
	}
}
