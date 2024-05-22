import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DrawService } from "../../draw.service";
import { FILL_STYLES, LINE_STYLES } from "../../consts/draw-consts.consts";

@Component({
	selector: "app-draw-polygon",
	templateUrl: "./draw-polygon.component.html",
	styleUrls: ["./draw-polygon.component.scss"],
})
export class DrawPolygonComponent implements OnInit {
	public polygonSize: number | undefined;
	public polygonFillColor: string;
	public polygonStrokeColor: string;
	@Input() public tool: string;
	@Output() public polygonSizeChange: EventEmitter<number> =
		new EventEmitter<number>();
	public allType = "polygon";
	public lineStyles = LINE_STYLES;

	public polygonFillStyles = FILL_STYLES;

	public async setPolygonFillStyle(event: Event) {
		const target = event.target as HTMLSelectElement;
		const style = target.value;
		await this.drawService.setFill(this.tool, style);
	}

	public async setLineStyle(event: Event) {
		const target = event.target as HTMLSelectElement;
		const style = target.value;
		this.drawService.setStyle(this.tool, style);
	}

	public updatePolygonSize() {
		this.polygonSizeChange.emit(this.polygonSize);
	}

	public constructor(private drawService: DrawService) {}

	public ngOnInit() {
		this.polygonSize = this.drawService.getSize(this.tool);
	}
}
