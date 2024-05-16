import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DrawService } from "../draw.service";
import { DrawLineStyles } from "../interfaces/draw.interface";

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
	lineStyles: DrawLineStyles = [
		"Solid",
		"Dotted",
		"Dashed",
		"DashDot",
		"DashDotDot",
	];

	setLineStyle(event: Event) {
		const target = event.target as HTMLSelectElement;
		const style = target.value;
		
		this.drawService.setStyle( this.tool, style);

		
	}
	updateLineSize() {
		this.lineSizeChange.emit(this.lineSize);
	}
	constructor(private drawService: DrawService) {}
}
