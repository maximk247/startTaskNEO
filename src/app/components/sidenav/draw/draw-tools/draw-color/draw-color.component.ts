import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DrawService } from "../../draw.service";

@Component({
	selector: "app-draw-color",
	templateUrl: "./draw-color.component.html",
	styleUrls: ["./draw-color.component.scss"],
})
export class DrawColorComponent {
	@Input() color: string;
	@Output() colorChange: EventEmitter<string> = new EventEmitter<string>();
	constructor(private drawService: DrawService) {}
	onColorChange(color: string) {
		this.color = color;
		this.drawService.setColor(this.color);
		this.colorChange.emit(this.color);
	}
}
