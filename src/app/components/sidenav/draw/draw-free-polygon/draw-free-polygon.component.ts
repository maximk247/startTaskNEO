import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DrawService } from "../draw.service";
import {
	DrawLineStyles,
	DrawPolygonFillStyles,
} from "../interfaces/draw.interface";

@Component({
	selector: "app-draw-free-polygon",
	templateUrl: "./draw-free-polygon.component.html",
	styleUrls: ["./draw-free-polygon.component.scss"],
})
export class DrawFreePolygonComponent {
	@Input() freePolygonSize: number;
	@Input() freePolygonFillColor: string;
	@Input() freePolygonStrokeColor: string;
	@Input() tool: string;
	@Output() freePolygonSizeChange: EventEmitter<number> =
		new EventEmitter<number>();
	allType = "polygon";
	lineStyles: DrawLineStyles = [
		"Solid",
		"Dotted",
		"Dashed",
		"DashDot",
		"DashDotDot",
	];

	polygonFillStyles: DrawPolygonFillStyles = [
		"Solid",
		"VerticalHatching",
		"HorizontalHatching",
		"CrossHatching",
		"DiagonalHatching",
		"ReverseDiagonalHatching",
		"DiagonalCrossHatching",
	];

	async setFreePolygonFillStyle(event: Event) {
		const target = event.target as HTMLSelectElement;
		const style = target.value;
		await this.drawService.setFreePolygonFill(style);
	}

	async setLineStyle(event: Event) {
		const target = event.target as HTMLSelectElement;
		const style = target.value;
		this.drawService.setStyle(this.tool, style);
	}

	updateFreePolygonSize() {
		this.freePolygonSizeChange.emit(this.freePolygonSize);
	}

	constructor(private drawService: DrawService) {}
}
