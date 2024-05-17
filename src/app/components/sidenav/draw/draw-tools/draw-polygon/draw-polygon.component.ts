import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DrawService } from "../../draw.service";
import {
	DrawFillStyles,
	DrawLineStyles,
} from "../../interfaces/draw.interface";

@Component({
	selector: "app-draw-polygon",
	templateUrl: "./draw-polygon.component.html",
	styleUrls: ["./draw-polygon.component.scss"],
})
export class DrawPolygonComponent implements OnInit {
	polygonSize: number | undefined;
	polygonFillColor: string;
	polygonStrokeColor: string;
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

	polygonFillStyles: DrawFillStyles = [
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

	ngOnInit() {
		this.polygonSize = this.drawService.getSize(this.tool);
	}
}
