import { Component, EventEmitter, Output } from "@angular/core";
import { MapService } from "src/app/modules/map/map.service";
import { Map } from "ol";
import { DrawService } from "../../../../../draw.service";
@Component({
	selector: "app-draw-delete-on-click",
	templateUrl: "./draw-delete-on-click.component.html",
	styleUrls: ["./draw-delete-on-click.component.scss"],
})
export class DrawDeleteOnClickComponent {
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
		this.mapService.addCursorToMap();
		const vectorLayer = this.drawService.getVectorLayer();
		const source = this.drawService.getVectorSource();
		if (vectorLayer && source) {
			this.mapService.removeFeatureOnMouseClick(this.map);
		}
		this.interactionDeleted.emit();
	}
}
