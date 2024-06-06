import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DrawService } from "../../../draw.service";
import { POINT_SHAPES } from "../../../consts/draw-consts.consts";

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

	public pointShapes = POINT_SHAPES;
	public constructor(private drawService: DrawService) {}

	public ngOnInit() {
		this.pointSize = this.drawService.getSize(this.tool);
	}

	public setPointShape(shape: string) {
		this.drawService.setPointShape(shape);
	}

	public updatePointSize() {
		this.pointSizeChange.emit(this.pointSize);
	}
}
