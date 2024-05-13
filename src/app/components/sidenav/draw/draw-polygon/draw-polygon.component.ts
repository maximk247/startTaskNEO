import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DrawService } from "../draw.service";

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
	lineStyles: Array<string> = [
		"Solid",
		"Dotted",
		"Dashed",
		"DashDot",
		"DashDotDot",
	];

	polygonFillStyles: Array<string> = [
		"Solid",
		"VerticalHatching",
		"HorizontalHatching",
		"CrossHatching",
		"DiagonalHatching",
		"ReverseDiagonalHatching",
		"DiagonalCrossHatching",
	];

	async getPolygonFillStyle() {
		const pattern = await this.drawService.stylePatternSimplePoly(
			"cross.png",
			this.polygonFillColor,
		);
		return pattern;
	}

	async setPolygonFillStyle(event: Event) {
		const target = event.target as HTMLSelectElement;
		const style = target.value;
		await this.drawService.setPolygonFill(style);
		const pattern = this.drawService.getPolygonFill();
		this.drawService.setStyle(this.tool, style, pattern);
	}

	async setLineStyle(event: Event) {
		const target = event.target as HTMLSelectElement;
		const style = target.value;
		const pattern = this.drawService.getPolygonFill();
		this.drawService.setStyle(this.tool, style, pattern);
	}

	updatePolygonSize() {
		this.polygonSizeChange.emit(this.polygonSize);
	}

	constructor(private drawService: DrawService) {}
}
