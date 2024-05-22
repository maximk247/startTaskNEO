import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DrawService } from "../../draw.service";
import { POINT_STYLES } from "../../consts/draw-consts.consts";

@Component({
	selector: "app-draw-point",
	templateUrl: "./draw-point.component.html",
	styleUrls: ["./draw-point.component.scss"],
})
export class DrawPointComponent implements OnInit {
	public pointSize: number | undefined;
	public pointColor: string;
	@Input() public tool: string;
	@Output() public pointSizeChange: EventEmitter<number> =
		new EventEmitter<number>();

	public pointStyles = POINT_STYLES
	public constructor(private drawService: DrawService) {}

	public ngOnInit() {
		this.pointSize = this.drawService.getSize(this.tool);
	}

	public setPointStyle(style: string) {
		this.drawService.setStyle(this.tool, style);
	}

	public updatePointSize() {
		this.pointSizeChange.emit(this.pointSize);
	}
}
