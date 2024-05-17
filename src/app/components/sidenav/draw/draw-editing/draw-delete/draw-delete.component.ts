import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MapService } from "src/app/components/map/map.service";
import { DrawService } from "../../draw.service";
import { Map } from "ol";
import { Draw } from "ol/interaction";

@Component({
	selector: "app-draw-delete",
	templateUrl: "./draw-delete.component.html",
	styleUrls: ["./draw-delete.component.scss"],
})
export class DrawDeleteComponent implements OnInit {
	map: Map;
	drawInteraction: Draw;
	@Output() interactionDeleted: EventEmitter<void> = new EventEmitter<void>();
	constructor(
		private mapService: MapService,
		private drawService: DrawService,
	) {}

	ngOnInit() {
		this.map = this.mapService.getMap();
		this.drawService.initalizeLayer();
		this.map.addLayer(this.drawService.getVectorLayer());
	}
	deleteOnMouseClick() {
		this.drawService.removeGlobalInteraction(this.map);
		const interactions = this.map.getInteractions().getArray();
		interactions.forEach((interaction) => {
			if (interaction.get("drawType") === "figure") {
				this.drawService.removeGlobalInteraction(this.map, interaction);
			}
		});
		const vectorLayer = this.drawService.getVectorLayer();
		const source = this.drawService.getSource();
		if (vectorLayer && source) {
			this.drawService.removeDrawingOnMouseClick(this.map, vectorLayer);
		}
		this.interactionDeleted.emit();
	}

	deleteAll() {
		this.drawService.removeAllDrawings(this.map);
		this.interactionDeleted.emit();
	}
}
