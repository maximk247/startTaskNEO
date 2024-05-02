import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "app-draw-point",
	templateUrl: "./draw-point.component.html",
	styleUrls: ["./draw-point.component.scss"],
})
export class DrawPointComponent {
	@Input() pointStyle: string;
	@Output() pointStyleChange: EventEmitter<string> = new EventEmitter<string>();

	setPointStyle(style: string) {
		this.pointStyle = style;
		this.pointStyleChange.emit(style);
	}
}
