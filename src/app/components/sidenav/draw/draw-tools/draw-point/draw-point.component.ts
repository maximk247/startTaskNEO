import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DrawService } from "../../draw.service";

@Component({
	selector: "app-draw-point",
	templateUrl: "./draw-point.component.html",
	styleUrls: ["./draw-point.component.scss"],
})
export class DrawPointComponent implements OnInit {
	pointSize: number | undefined;
	pointColor: string;
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

	ngOnInit() {
		this.pointSize = this.drawService.getSize(this.tool);
	}

	setPointStyle(style: string) {
		this.drawService.setStyle(this.tool, style);
	}

	updatePointSize() {
		this.pointSizeChange.emit(this.pointSize);
	}
}
