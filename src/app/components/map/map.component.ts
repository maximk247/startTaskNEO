import { AfterViewInit, Component } from "@angular/core";
import { Coordinate } from "ol/coordinate";

import { MapService } from "./map.service";
import { KeycloakService } from "keycloak-angular";

@Component({
	selector: "app-map",
	templateUrl: "./map.component.html",
	styleUrls: ["./map.component.scss"],
})
export class MapComponent implements AfterViewInit {
	coordinates: Coordinate;
	formattedCoordinates: string;

	constructor(
		private mapService: MapService,
		public atest: KeycloakService,
	) {}

	public onLogout(): void {
		this.atest.logout();
	}

	ngAfterViewInit() {
		this.mapService.initMap("map");
	}
}
