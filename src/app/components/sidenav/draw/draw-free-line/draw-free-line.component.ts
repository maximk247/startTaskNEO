import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DrawService } from "../draw.service";

@Component({
	selector: "app-draw-free-line",
	templateUrl: "./draw-free-line.component.html",
	styleUrls: ["./draw-free-line.component.scss"],
})
export class DrawFreeLineComponent {
	@Input() freeLineSize: number;
	@Input() freeLineColor: string;
	@Input() tool: string;
	@Output() freeLineSizeChange: EventEmitter<number> =
		new EventEmitter<number>();
	lineStyles: Array<string> = [
		"Solid",
		"Dotted",
		"Dashed",
		"DashDot",
		"DashDotDot",
	];

	setLineStyle(event: Event) {
		const target = event.target as HTMLSelectElement;
		const style = target.value;

		this.drawService.setStyle(this.tool, style);
	}
	updateLineSize() {
		this.freeLineSizeChange.emit(this.freeLineSize);
	}
	constructor(private drawService: DrawService) {}
}
