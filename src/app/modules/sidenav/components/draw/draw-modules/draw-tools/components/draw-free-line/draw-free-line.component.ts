import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { STROKE_STYLES } from "../../../../consts/draw-consts.consts";
import { DrawService } from "../../../../draw.service";

@Component({
	selector: "app-draw-free-line",
	templateUrl: "./draw-free-line.component.html",
	styleUrls: ["./draw-free-line.component.scss"],
})
export class DrawFreeLineComponent implements OnInit {
	public freeLineSize: number | undefined;
	public freeLineColor: string;
	@Input() public tool: string;
	@Output() public freeLineSizeChange: EventEmitter<number> =
		new EventEmitter<number>();
	public strokeStyles = STROKE_STYLES;

	public setStrokeStyle(event: Event) {
		const target = event.target as HTMLSelectElement;
		const style = target.value;

		this.drawService.setStrokeStyle(this.tool, style);
	}
	public updateLineSize() {
		this.freeLineSizeChange.emit(this.freeLineSize);
	}
	public constructor(private drawService: DrawService) {}
	public ngOnInit() {
		this.freeLineSize = this.drawService.getSize(this.tool);
	}
}
