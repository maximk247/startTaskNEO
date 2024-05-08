import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DrawService } from "../draw.service";

@Component({
	selector: "app-draw-line",
	templateUrl: "./draw-line.component.html",
	styleUrls: ["./draw-line.component.scss"],
})
export class DrawLineComponent {
	@Input() lineSize: number;
	@Input() lineColor: string;
	@Input() tool: string;
	@Output() lineSizeChange: EventEmitter<number> =
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

		this.drawService.setLineStyle(style);
	}
	updatelineSize() {
		this.lineSizeChange.emit(this.lineSize);
	}
	constructor(private drawService: DrawService) {}
}
