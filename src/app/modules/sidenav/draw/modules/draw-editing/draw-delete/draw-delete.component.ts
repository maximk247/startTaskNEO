import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MapService } from "src/app/modules/map/map.service";
import { DrawService } from "../../../draw.service";
import { Map } from "ol";
import { DrawType } from "../../../enum/draw.enum";

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
		this.drawService.initalizeLayer();
		this.map.addLayer(this.drawService.getVectorLayer());
	}
	public deleteOnMouseClick() {
		this.drawService.removeGlobalInteraction(this.map);
		const interactions = this.map.getInteractions().getArray();
		interactions.forEach((interaction) => {
			if (interaction.get("drawType") === "figure") {
				this.drawService.removeGlobalInteraction(this.map, interaction);
			}
		});
		const vectorLayer = this.drawService.getVectorLayer();
		const source = this.drawService.getVectorSource();
		if (vectorLayer && source) {
			this.mapService.removeFeatureOnMouseClick(this.map, vectorLayer);
		}
		this.interactionDeleted.emit();
	}

	public deleteAll() {
		this.mapService.removeAllFeatures(DrawType.Draw)
		this.interactionDeleted.emit();
	}
}