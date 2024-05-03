import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
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
	) {}

	onClose(status: string): void {
		if (status === "accept") {
			this.drawService.setColor(this.color);
		}
		this.dialogRef.close(this.color);
	}
}
