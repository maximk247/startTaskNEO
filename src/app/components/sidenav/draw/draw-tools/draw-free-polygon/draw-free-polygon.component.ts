import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DrawService } from "../../draw.service";
import {
	DrawFillStyles,
	DrawLineStyles,
} from "../../interfaces/draw.interface";

@Component({
	selector: "app-draw-free-polygon",
	templateUrl: "./draw-free-polygon.component.html",
	styleUrls: ["./draw-free-polygon.component.scss"],
})
export class DrawFreePolygonComponent implements OnInit {
	freePolygonSize: number | undefined;
	freePolygonFillColor: string;
	freePolygonStrokeColor: string;
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

	polygonFillStyles: DrawFillStyles = [
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

	ngOnInit() {
		this.freePolygonSize = this.drawService.getSize(this.tool);
	}
}
