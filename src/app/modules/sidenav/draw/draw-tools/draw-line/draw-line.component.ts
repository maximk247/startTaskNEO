import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DrawService } from "../../draw.service";

import { LINE_STYLES } from "../../consts/draw-consts.consts";

@Component({
	selector: "app-draw-line",
	templateUrl: "./draw-line.component.html",
	styleUrls: ["./draw-line.component.scss"],
})
export class DrawLineComponent implements OnInit {
	public lineSize: number | undefined;
	public lineColor: string;
	@Input() public tool: string;
	@Output() public lineSizeChange: EventEmitter<number> =
		new EventEmitter<number>();
	public lineStyles = LINE_STYLES;

	public setLineStyle(event: Event) {
		const target = event.target as HTMLSelectElement;
		const style = target.value;

		this.drawService.setStyle(this.tool, style);
	}
	public updateLineSize() {
		this.lineSizeChange.emit(this.lineSize);
	}
	public constructor(private drawService: DrawService) {}
	public ngOnInit() {
		this.lineSize = this.drawService.getSize(this.tool);
	}
}
