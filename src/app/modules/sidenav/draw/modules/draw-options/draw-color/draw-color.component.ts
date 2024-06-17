import { Component, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "src/app/modules/sidenav/draw/modules/dialog/dialog.component";

@Component({
	selector: "app-draw-color",
	templateUrl: "./draw-color.component.html",
	styleUrls: ["./draw-color.component.scss"],
})
export class DrawColorComponent {
	@Input() public tool: string;
	@Input() public color: string;
	@Input() public type: string;
	public constructor(private dialog: MatDialog) {}

	public openColorDialog(): void {
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
