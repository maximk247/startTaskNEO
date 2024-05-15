import { Component } from "@angular/core";
import { MapService } from "../../map/map.service";
import Map from "ol/Map";
@Component({
	selector: "app-coordinates",
	templateUrl: "./coordinates.component.html",
	styleUrls: ["./coordinates.component.scss"],
})
export class CoordinatesComponent {
	latitudeDegrees: number;
	latitudeMinutes: number;
	latitudeSeconds: number;
	longitudeDegrees: number;
	longitudeMinutes: number;
	longitudeSeconds: number;
	map: Map;

	constructor(private mapService: MapService) {}

	ngOnInit() {
		this.map = this.mapService.getMap();
	}

	goToCoordinates() {
		const latitude =
			this.latitudeDegrees +
			this.latitudeMinutes / 60 +
			this.latitudeSeconds / 3600;
		const longitude =
			this.longitudeDegrees +
			this.longitudeMinutes / 60 +
			this.longitudeSeconds / 3600;

		this.map.getView().setCenter([longitude, latitude]);
	}
}
