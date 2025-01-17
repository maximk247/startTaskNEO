import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
	STROKE_STYLES,
	FILL_STYLES,
} from "../../../../consts/draw-consts.consts";
import { DrawService } from "../../../../draw.service";

@Component({
	selector: "app-draw-polygon",
	templateUrl: "./draw-polygon.component.html",
	styleUrls: ["./draw-polygon.component.scss"],
})
export class DrawPolygonComponent implements OnInit {
	public polygonSize: number | undefined;
	public polygonFillColor: string;
	public polygonStrokeColor: string;
	public addCoordinates: boolean;
	@Input() public tool: string;
	@Output() public polygonSizeChange: EventEmitter<number> =
		new EventEmitter<number>();
	public type = "polygon";
	public strokeStyles = STROKE_STYLES;

	public polygonFillStyles = FILL_STYLES;

	public async setPolygonFillStyle(event: Event) {
		const target = event.target as HTMLSelectElement;
		const style = target.value;
		await this.drawService.setFill(this.tool, style);
	}

	public async setStrokeStyle(event: Event) {
		const target = event.target as HTMLSelectElement;
		const style = target.value;
		this.drawService.setStrokeStyle(this.tool, style);
	}

	public updatePolygonSize() {
		this.polygonSizeChange.emit(this.polygonSize);
	}

	public constructor(private drawService: DrawService) {}

	public ngOnInit() {
		this.polygonSize = this.drawService.getSize(this.tool);
	}
}
