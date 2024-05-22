import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DrawService } from "../../draw.service";
import { FILL_STYLES, LINE_STYLES } from "../../consts/draw-consts.consts";

@Component({
	selector: "app-draw-figure",
	templateUrl: "./draw-figure.component.html",
	styleUrls: ["./draw-figure.component.scss"],
})
export class DrawFigureComponent implements OnInit {
	public figureSize: number | undefined;
	public figureFillColor: string;
	public figureStrokeColor: string;
	@Input() public tool: string;
	@Output() public figureSizeChange: EventEmitter<number> =
		new EventEmitter<number>();
	public allType = "figure";
	public lineStyles = LINE_STYLES;

	public figureFillStyles = FILL_STYLES;

	public constructor(private drawService: DrawService) {}

	public ngOnInit() {
		this.figureSize = this.drawService.getSize(this.tool);
	}

	public async setFigureFillStyle(event: Event) {
		const target = event.target as HTMLSelectElement;
		const style = target.value;
		await this.drawService.setFill(this.tool,style);
	}

	public async setLineStyle(event: Event) {
		const target = event.target as HTMLSelectElement;
		const style = target.value;
		this.drawService.setStyle(this.tool, style);
	}

	public updateFigureSize() {
		this.figureSizeChange.emit(this.figureSize);
	}
}
