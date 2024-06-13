import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MapService } from "src/app/modules/map/map.service";
import { DrawService } from "../../../draw.service";
import { Map } from "ol";
import { SidenavTools } from "src/app/modules/sidenav/interfaces/sidenav.interface";
import { Draw } from "ol/interaction";

@Component({
	selector: "app-draw-delete",
	templateUrl: "./draw-delete.component.html",
	styleUrls: ["./draw-delete.component.scss"],
})
export class DrawDeleteComponent implements OnInit {
	private map: Map;
	@Output() public interactionDeleted: EventEmitter<void> =
		new EventEmitter<void>();
	public constructor(
		private mapService: MapService,
		private drawService: DrawService,
	) {}

	public ngOnInit() {
		this.map = this.mapService.getMap();
	}
	public deleteOnMouseClick() {
		const vectorLayer = this.drawService.getVectorLayer();
		const source = this.drawService.getVectorSource();
		if (vectorLayer && source) {
			this.mapService.removeFeatureOnMouseClick(this.map);
		}
		this.interactionDeleted.emit();
	}

	public deleteAll() {
		this.mapService.removeAllFeatures(SidenavTools.Draw);
	}
}
