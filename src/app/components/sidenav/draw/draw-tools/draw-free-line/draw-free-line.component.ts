import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DrawService } from "../../draw.service";
import { DrawLineStyles } from "../../interfaces/draw.interface";

@Component({
	selector: "app-draw-free-line",
	templateUrl: "./draw-free-line.component.html",
	styleUrls: ["./draw-free-line.component.scss"],
})
export class DrawFreeLineComponent implements OnInit {
	freeLineSize: number | undefined;
	freeLineColor: string;
	@Input() tool: string;
	@Output() freeLineSizeChange: EventEmitter<number> =
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

		this.drawService.setStyle(this.tool, style);
	}
	updateLineSize() {
		this.freeLineSizeChange.emit(this.freeLineSize);
	}
	constructor(private drawService: DrawService) {}
	ngOnInit() {
		this.freeLineSize = this.drawService.getSize(this.tool);
	}
}
