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
		@Inject(MAT_DIALOG_DATA) public data: any,
	) {}

	onClose(status: string): void {
		if (status === "accept") {
			if (this.color.indexOf("rgba") === -1) {
				this.color = this.color.replace("rgb", "rgba").replace(")", ", 1)");
			}
			console.log(this.data.tool);
			this.drawService.setColor(this.color, this.data.tool);
		}
		this.dialogRef.close(this.color);
	}
}
