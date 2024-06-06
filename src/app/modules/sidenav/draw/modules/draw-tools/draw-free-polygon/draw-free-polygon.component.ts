import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DrawService } from "../../../draw.service";

import { FILL_STYLES, STROKE_STYLES } from "../../../consts/draw-consts.consts";

@Component({
	selector: "app-draw-free-polygon",
	templateUrl: "./draw-free-polygon.component.html",
	styleUrls: ["./draw-free-polygon.component.scss"],
})
export class DrawFreePolygonComponent implements OnInit {
	public freePolygonSize: number | undefined;
	public freePolygonFillColor: string;
	public freePolygonStrokeColor: string;
	@Input() public tool: string;
	@Output() public freePolygonSizeChange: EventEmitter<number> =
		new EventEmitter<number>();
	public type = "polygon";
	public strokeStyles = STROKE_STYLES;

	public polygonFillStyles = FILL_STYLES;

	public async setFreePolygonFillStyle(event: Event) {
		const target = event.target as HTMLSelectElement;
		const style = target.value;
		await this.drawService.setFill(this.tool, style);
	}

	public async setStrokeStyle(event: Event) {
		const target = event.target as HTMLSelectElement;
		const style = target.value;
		this.drawService.setStrokeStyle(this.tool, style);
	}

	public updateFreePolygonSize() {
		this.freePolygonSizeChange.emit(this.freePolygonSize);
	}

	public constructor(private drawService: DrawService) {}

	public ngOnInit() {
		this.freePolygonSize = this.drawService.getSize(this.tool);
	}
}
