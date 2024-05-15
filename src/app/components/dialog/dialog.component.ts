import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DrawService } from "../sidenav/draw/draw.service";

@Component({
	selector: "app-dialog",
	templateUrl: "./dialog.component.html",
	styleUrls: ["./dialog.component.scss"],
})
export class DialogComponent {
	color: string;
	constructor(
		private dialogRef: MatDialogRef<DialogComponent>,
		private drawService: DrawService,
		@Inject(MAT_DIALOG_DATA)
		public data: {
			tool: string;
			color: string;
			type?: string;
		},
	) {}

	onClose(status: string): void {
		if (status === "accept") {
			if (this.color.indexOf("rgba") === -1) {
				this.color = this.color.replace("rgb", "rgba").replace(")", ", 1)");
			}
			if (
				this.data.tool === "drawPolygon" ||
				this.data.tool === "drawFreePolygon" ||
				this.data.tool === "drawFigure"
			) {
				this.drawService.setColor(this.color, this.data.tool, this.data.type);
			} else this.drawService.setColor(this.color, this.data.tool);
		}
		this.dialogRef.close(this.color);
	}
}
