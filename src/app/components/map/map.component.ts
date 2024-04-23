import { AfterViewInit, Component, ElementRef } from "@angular/core";
import { Coordinate } from "ol/coordinate";

import { MapService } from "./map.service";

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
		private elementRef: ElementRef,
	) {}

	ngAfterViewInit() {
		const scaleBarElement =
			this.elementRef.nativeElement.querySelector(".scale-bar");
		const mousePositionElement =
			this.elementRef.nativeElement.querySelector(".cursor-controls");
		this.mapService.initMap("map", scaleBarElement, mousePositionElement);
	}
}
