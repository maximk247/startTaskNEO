import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DrawService } from "../draw.service";

@Component({
	selector: "app-draw-point",
	templateUrl: "./draw-point.component.html",
	styleUrls: ["./draw-point.component.scss"],
})
export class DrawPointComponent {
	@Input() pointStyle: string;
	@Input() pointColor: string;
	@Input() pointSize: number;
	@Output() pointStyleChange: EventEmitter<string> = new EventEmitter<string>();
	@Output() pointSizeChange: EventEmitter<number> = new EventEmitter<number>();
	@Output() pointColorChange: EventEmitter<string> = new EventEmitter<string>();

	constructor(private drawService: DrawService) {}

	setPointStyle(style: string) {
		this.pointStyle = style;
		this.pointStyleChange.emit(style);
	}

	updatePointSize() {
		this.pointSizeChange.emit(this.pointSize);
	}

	updatePointColor(color: string) {
		this.pointColor = color;
		this.drawService.setColor(color);
	}
}
