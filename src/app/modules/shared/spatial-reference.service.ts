import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { SpatialReference } from "./interfaces/spatial-reference.interfaces";

@Injectable({
	providedIn: "root",
})
export class SpatialReferenceService {
	private apiUrl =
		"http://gs-yung.neostk.com/neoportal/api/gisp-api/SpatialReferences?mapId=1&api-version=2";

	public constructor(private http: HttpClient) {}

	public getSpatialReferences(): Observable<Array<SpatialReference>> {
		return this.http.get<Array<SpatialReference>>(this.apiUrl);
	}
}
