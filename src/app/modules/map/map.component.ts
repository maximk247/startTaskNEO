import { AfterViewInit, Component } from "@angular/core";
import { Coordinate } from "ol/coordinate";

import { MapService } from "./map.service";

@Component({
	selector: "app-map",
	templateUrl: "./map.component.html",
	styleUrls: ["./map.component.scss"],
})
export class MapComponent implements AfterViewInit {
	public coordinates: Coordinate;
	public formattedCoordinates: string;

	public constructor(private mapService: MapService) {}

	public ngAfterViewInit() {
		this.mapService.initMap("map");
	}
}
