import { Component, OnInit } from "@angular/core";
import { Polygon } from "ol/geom";
import Map from "ol/Map";
import Draw, {
	createRegularPolygon,
	createBox,
	GeometryFunction,
} from "ol/interaction/Draw";
import { DrawService } from "../../draw.service";
import { MapService } from "src/app/components/map/map.service";
import { Coordinate } from "ol/coordinate";

@Component({
	selector: "app-draw-shape",
	templateUrl: "./draw-shape.component.html",
	styleUrls: ["./draw-shape.component.scss"],
})
export class DrawShapeComponent implements OnInit {
	private map: Map;
	public activeInteraction: Draw | null = null;
	public constructor(
		private drawService: DrawService,
		private mapService: MapService,
	) {}
	public ngOnInit() {
		this.map = this.mapService.getMap();
	}
	public addDrawInteraction(shape: string) {
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
				geometryFunction = function (
					coordinates: Array<Coordinate>,
					geometry?: Polygon,
				) {
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
					const arrowWidth = len / 10;
					const halfArrowWidth = arrowWidth / 2;

					const arrowCoords = [
						[start[0] - halfArrowWidth * sin, start[1] + halfArrowWidth * cos],
						[start[0] + halfArrowWidth * sin, start[1] - halfArrowWidth * cos],
						[
							start[0] + halfArrowWidth * sin + cos * (len - arrowHeadLen),
							start[1] - halfArrowWidth * cos + sin * (len - arrowHeadLen),
						],
						[
							start[0] +
								halfArrowWidth * sin +
								cos * (len - arrowHeadLen) -
								(sin * arrowHeadLen) / 2,
							start[1] -
								halfArrowWidth * cos +
								sin * (len - arrowHeadLen) +
								(cos * arrowHeadLen) / 2,
						],
						[end[0], end[1]],
						[
							start[0] -
								halfArrowWidth * sin +
								cos * (len - arrowHeadLen) +
								(sin * arrowHeadLen) / 2,
							start[1] +
								halfArrowWidth * cos +
								sin * (len - arrowHeadLen) -
								(cos * arrowHeadLen) / 2,
						],
						[
							start[0] - halfArrowWidth * sin + cos * (len - arrowHeadLen),
							start[1] + halfArrowWidth * cos + sin * (len - arrowHeadLen),
						],
						[start[0] - halfArrowWidth * sin, start[1] + halfArrowWidth * cos],
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
			geometryFunction as GeometryFunction | undefined,
		);
		this.activeInteraction = drawFigure;
		this.map.addInteraction(drawFigure);
	}
}
