import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DrawService } from "../draw.service";
import {
	DrawFillStyle,
	DrawLineStyles,
	DrawPolygonFillStyle,
	DrawPolygonFillStyles,
} from "../interfaces/draw.interface";

@Component({
	selector: "app-draw-polygon",
	templateUrl: "./draw-polygon.component.html",
	styleUrls: ["./draw-polygon.component.scss"],
})
export class DrawPolygonComponent {
	@Input() polygonSize: number;
	@Input() polygonFillColor: string;
	@Input() polygonStrokeColor: string;
	@Input() tool: string;
	@Output() polygonSizeChange: EventEmitter<number> =
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

	async setPolygonFillStyle(event: Event) {
		const target = event.target as HTMLSelectElement;
		const style = target.value;
		await this.drawService.setPolygonFill(style);
	}

	async setLineStyle(event: Event) {
		const target = event.target as HTMLSelectElement;
		const style = target.value;
		this.drawService.setStyle(this.tool, style);
	}

	updatePolygonSize() {
		this.polygonSizeChange.emit(this.polygonSize);
	}

	constructor(private drawService: DrawService) {}
}
