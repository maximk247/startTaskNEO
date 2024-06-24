import { Component, EventEmitter, Output } from "@angular/core";
import { MapService } from "src/app/modules/map/map.service";

import { SidenavTools } from "src/app/modules/sidenav/enums/sidenav.enums";
@Component({
	selector: "app-draw-delete-all",
	templateUrl: "./draw-delete-all.component.html",
	styleUrls: ["./draw-delete-all.component.scss"],
})
export class DrawDeleteAllComponent {
	@Output() public interactionDeleted: EventEmitter<void> =
		new EventEmitter<void>();
	public constructor(private mapService: MapService) {}

	public deleteAll() {
		this.mapService.removeAllFeatures(SidenavTools.Draw);
	}
}
