import { Component, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "src/app/components/dialog/dialog.component";

@Component({
	selector: "app-draw-color",
	templateUrl: "./draw-color.component.html",
	styleUrls: ["./draw-color.component.scss"],
})
export class DrawColorComponent {
	@Input() tool: string;
	@Input() color: string;
	@Input() type: string;
	constructor(private dialog: MatDialog) {}

	openColorDialog(): void {
		this.dialog.open(DialogComponent, {
			disableClose: true,
			data: {
				tool: this.tool,
				color: this.color,
				type: this.type,
			},
		});
	}
}
