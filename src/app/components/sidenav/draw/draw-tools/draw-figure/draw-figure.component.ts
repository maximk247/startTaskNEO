import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DrawService } from "../../draw.service";
import {
	DrawFillStyles,
	DrawLineStyles,
} from "../../interfaces/draw.interface";

@Component({
	selector: "app-draw-figure",
	templateUrl: "./draw-figure.component.html",
	styleUrls: ["./draw-figure.component.scss"],
})
export class DrawFigureComponent implements OnInit {
	figureSize: number | undefined;
	figureFillColor: string;
	figureStrokeColor: string;
	@Input() tool: string;
	@Output() figureSizeChange: EventEmitter<number> = new EventEmitter<number>();
	allType = "figure";
	lineStyles: DrawLineStyles = [
		"Solid",
		"Dotted",
		"Dashed",
		"DashDot",
		"DashDotDot",
	];

	figureFillStyles: DrawFillStyles = [
		"Solid",
		"VerticalHatching",
		"HorizontalHatching",
		"CrossHatching",
		"DiagonalHatching",
		"ReverseDiagonalHatching",
		"DiagonalCrossHatching",
	];

	constructor(private drawService: DrawService) {}

	ngOnInit() {
		this.figureSize = this.drawService.getSize(this.tool);
	}

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
}
