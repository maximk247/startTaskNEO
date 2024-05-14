import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DrawService } from "../draw.service";

@Component({
	selector: "app-draw-figure",
	templateUrl: "./draw-figure.component.html",
	styleUrls: ["./draw-figure.component.scss"],
})
export class DrawFigureComponent {
	@Input() figureSize: number;
	@Input() figureFillColor: string;
	@Input() figureStrokeColor: string;
	@Input() tool: string;
	@Output() figureSizeChange: EventEmitter<number> =
		new EventEmitter<number>();
	allType = "figure";
	lineStyles: Array<string> = [
		"Solid",
		"Dotted",
		"Dashed",
		"DashDot",
		"DashDotDot",
	];

	figureFillStyles: Array<string> = [
		"Solid",
		"VerticalHatching",
		"HorizontalHatching",
		"CrossHatching",
		"DiagonalHatching",
		"ReverseDiagonalHatching",
		"DiagonalCrossHatching",
	];

	async setFigureFillStyle(event: Event) {
		const target = event.target as HTMLSelectElement;
		const style = target.value;
		await this.drawService.setFigureFill(style);
	}

	async setLineStyle(event: Event) {
		const target = event.target as HTMLSelectElement;
		const style = target.value;
		this.drawService.setStyle(this.tool, style);
	}

	updateFigureSize() {
		this.figureSizeChange.emit(this.figureSize);
	}

	constructor(private drawService: DrawService) {}
}
