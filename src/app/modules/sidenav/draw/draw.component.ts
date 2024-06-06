import { Component, OnInit } from "@angular/core";
import Map from "ol/Map";
import { MapService } from "../../map/map.service";
import { DrawService } from "./draw.service";
import { Draw } from "ol/interaction";
import { DrawToolKey, DrawTools } from "./interfaces/draw.interface";
import { TOOLS } from "./consts/draw-consts.consts";
import { DrawType } from "./enum/draw.enum";

@Component({
	selector: "app-draw",
	templateUrl: "./draw.component.html",
	styleUrls: ["./draw.component.scss"],
})
export class DrawComponent implements OnInit {
	private map: Map;
	public tools = TOOLS;

	private activeInteraction: Draw | null = null;

	public constructor(
		private mapService: MapService,
		private drawService: DrawService,
	) {}

	public ngOnInit() {
		this.map = this.mapService.getMap();
		const interactions = this.map.getInteractions().getArray();
		interactions.forEach((interaction) => {
			if (interaction.get("drawType") === DrawType.Measurement) {
				this.drawService.removeGlobalInteraction(this.map, interaction);
			}
		});
		this.drawService.initalizeLayer();
		this.map.addLayer(this.drawService.getVectorLayer());
	}

	public componentVisibility: DrawTools = {
		drawPoint: false,
		drawLine: false,
		drawFreeLine: false,
		drawPolygon: false,
		drawFreePolygon: false,
		drawFigure: false,
	};

	public updateSize(size: number, tool: DrawToolKey) {
		this.drawService.setSize(size, tool);
	}
	public deleteActiveInteraction() {
		this.drawService.removeGlobalInteraction(this.map, this.activeInteraction);
	}
	private resetComponentVisibility() {
		for (const key in this.componentVisibility) {
			this.componentVisibility[key] = false;
		}
	}

	public drawPoint() {
		this.resetComponentVisibility();
		this.componentVisibility = {
			...this.componentVisibility,
			drawPoint: true,
		};
		this.drawService.removeGlobalInteraction(this.map, this.activeInteraction);
		const interactions = this.map.getInteractions().getArray();
		interactions.forEach((interaction) => {
			if (
				interaction.get("drawType") === DrawType.Draw ||
				interaction.get("drawType") === DrawType.Measurement
			) {
				this.drawService.removeGlobalInteraction(this.map, interaction);
			}
		});
		const drawPoint = this.drawService.initializePoint(this.map);
		this.activeInteraction = drawPoint;
		this.drawService.addGlobalInteraction(this.map, drawPoint);
	}

	public drawLine() {
		this.resetComponentVisibility();
		this.componentVisibility = {
			...this.componentVisibility,
			drawLine: true,
		};
		this.drawService.removeGlobalInteraction(this.map, this.activeInteraction);
		const interactions = this.map.getInteractions().getArray();
		interactions.forEach((interaction) => {
			if (
				interaction.get("drawType") === DrawType.Draw ||
				interaction.get("drawType") === DrawType.Measurement
			) {
				this.drawService.removeGlobalInteraction(this.map, interaction);
			}
		});
		const drawLine = this.drawService.initializeLine(this.map);
		this.activeInteraction = drawLine;
		this.drawService.addGlobalInteraction(this.map, drawLine);
	}

	public drawPolygon() {
		this.resetComponentVisibility();
		this.componentVisibility = {
			...this.componentVisibility,
			drawPolygon: true,
		};
		this.drawService.removeGlobalInteraction(this.map, this.activeInteraction);
		const interactions = this.map.getInteractions().getArray();
		interactions.forEach((interaction) => {
			if (
				interaction.get("drawType") === DrawType.Draw ||
				interaction.get("drawType") === DrawType.Measurement
			) {
				this.drawService.removeGlobalInteraction(this.map, interaction);
			}
		});
		const drawPolygon = this.drawService.initializePolygon(this.map);
		this.activeInteraction = drawPolygon;
		this.drawService.addGlobalInteraction(this.map, drawPolygon);
	}

	public drawFreeLine() {
		this.resetComponentVisibility();
		this.componentVisibility = {
			...this.componentVisibility,
			drawFreeLine: true,
		};
		this.drawService.removeGlobalInteraction(this.map, this.activeInteraction);
		const interactions = this.map.getInteractions().getArray();
		interactions.forEach((interaction) => {
			if (
				interaction.get("drawType") === DrawType.Draw ||
				interaction.get("drawType") === DrawType.Measurement
			) {
				this.drawService.removeGlobalInteraction(this.map, interaction);
			}
		});
		const drawFreeLine = this.drawService.initalizeFreeLine(this.map);
		this.activeInteraction = drawFreeLine;
		this.drawService.addGlobalInteraction(this.map, drawFreeLine);
	}

	public drawFreePolygon() {
		this.resetComponentVisibility();
		this.componentVisibility = {
			...this.componentVisibility,
			drawFreePolygon: true,
		};
		this.drawService.removeGlobalInteraction(this.map, this.activeInteraction);
		const interactions = this.map.getInteractions().getArray();
		interactions.forEach((interaction) => {
			if (
				interaction.get("drawType") === DrawType.Draw ||
				interaction.get("drawType") === DrawType.Measurement
			) {
				this.drawService.removeGlobalInteraction(this.map, interaction);
			}
		});
		const drawFreePolygon = this.drawService.initalizeFreePolygon(this.map);
		this.activeInteraction = drawFreePolygon;
		this.drawService.addGlobalInteraction(this.map, drawFreePolygon);
	}

	public drawFigure() {
		this.resetComponentVisibility();
		this.componentVisibility = {
			...this.componentVisibility,
			drawFigure: true,
		};
		this.drawService.removeGlobalInteraction(this.map, this.activeInteraction);
		const interactions = this.map.getInteractions().getArray();
		interactions.forEach((interaction) => {
			if (interaction.get("drawType") === DrawType.Measurement) {
				this.drawService.removeGlobalInteraction(this.map, interaction);
			}
		});
		const drawFigure = this.drawService.initializeFigure(this.map, "Circle");
		this.activeInteraction = drawFigure;
		this.drawService.addGlobalInteraction(this.map, drawFigure);
	}
}