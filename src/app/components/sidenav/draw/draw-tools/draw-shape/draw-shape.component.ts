import { Component, OnInit } from "@angular/core";
import { Polygon } from "ol/geom";
import Map from "ol/Map";
import Draw, { createRegularPolygon, createBox } from "ol/interaction/Draw";
import { DrawService } from "../../draw.service";
import { MapService } from "src/app/components/map/map.service";

@Component({
	selector: "app-draw-shape",
	templateUrl: "./draw-shape.component.html",
	styleUrls: ["./draw-shape.component.scss"],
})
export class DrawShapeComponent implements OnInit {
	private map: Map;
	activeInteraction: Draw | null = null;
	constructor(
		private drawService: DrawService,
		private mapService: MapService,
	) {}
	ngOnInit() {
		this.map = this.mapService.getMap();
	}
	addDrawInteraction(shape: string) {
		let geometryFunction;
		switch (shape) {
			case "Circle":
				this.drawService.removeGlobalInteraction(this.map);
				geometryFunction = undefined;
				break;
			case "Square":
				this.drawService.removeGlobalInteraction(this.map);
				geometryFunction = createRegularPolygon(4);
				break;
			case "Rectangle":
				this.drawService.removeGlobalInteraction(this.map);
				geometryFunction = createBox();
				break;
			case "Triangle":
				this.drawService.removeGlobalInteraction(this.map);
				geometryFunction = createRegularPolygon(3);

				break;
			case "Arrow":
				this.drawService.removeGlobalInteraction(this.map);
				geometryFunction = function (coordinates: any, geometry: any) {
					if (!geometry) {
						geometry = new Polygon([]);
					}
					const start = coordinates[0];
					const end = coordinates[1];
					const dx = end[0] - start[0];
					const dy = end[1] - start[1];
					const len = Math.sqrt(dx * dx + dy * dy);
					const sin = dy / len;
					const cos = dx / len;

					const arrowHeadLen = len / 3;

					const arrowCoords = [
						start,
						[
							start[0] + cos * (len - arrowHeadLen),
							start[1] + sin * (len - arrowHeadLen),
						],
						[
							start[0] + cos * (len - arrowHeadLen) - (sin * arrowHeadLen) / 2,
							start[1] + sin * (len - arrowHeadLen) + (cos * arrowHeadLen) / 2,
						],
						end,
						[
							start[0] + cos * (len - arrowHeadLen) + (sin * arrowHeadLen) / 2,
							start[1] + sin * (len - arrowHeadLen) - (cos * arrowHeadLen) / 2,
						],
						[
							start[0] + cos * (len - arrowHeadLen),
							start[1] + sin * (len - arrowHeadLen),
						],
						start,
					];

					geometry.setCoordinates([arrowCoords]);
					return geometry;
				};

				break;
		}
		const interactions = this.map.getInteractions().getArray();
		interactions.forEach((interaction) => {
			if (interaction.get("drawType") === "figure") {
				this.drawService.removeGlobalInteraction(this.map, interaction);
			}
		});
		const drawFigure = this.drawService.initializeFigure(
			this.map,
			"Circle",
			geometryFunction,
		);
		this.activeInteraction = drawFigure;
		this.map.addInteraction(drawFigure);
	}
}
