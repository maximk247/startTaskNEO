import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DrawService } from "../draw.service";

@Component({
	selector: "app-draw-point",
	templateUrl: "./draw-point.component.html",
	styleUrls: ["./draw-point.component.scss"],
})
export class DrawPointComponent {
	@Input() pointSize: number;
	@Input() pointColor: string;
	@Input() tool: string;
	@Output() pointSizeChange: EventEmitter<number> = new EventEmitter<number>();

	pointStyles: Array<string> = [
		"Circle",
		"Cross",
		"Square",
		"Diamond",
		"Cancel",
	];
	constructor(private drawService: DrawService) {}


	setPointStyle(style: string) {
		this.drawService.setPointStyle(style);
	}

	updatePointSize() {
		this.pointSizeChange.emit(this.pointSize);
	}
}
