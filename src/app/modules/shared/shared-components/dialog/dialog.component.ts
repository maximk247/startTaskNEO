import { Component, Inject, Renderer2 } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DrawService } from "src/app/modules/sidenav/components/draw/draw.service";
import { DialogData } from "./interfaces/dialog.interface";
import { Tools } from "src/app/modules/sidenav/components/draw/enum/draw.enum";

@Component({
	selector: "app-dialog",
	templateUrl: "./dialog.component.html",
	styleUrls: ["./dialog.component.scss"],
})
export class DialogComponent {
	public color: string | undefined;
	public newColor: string;
	public constructor(
		private dialogRef: MatDialogRef<DialogComponent>,
		private drawService: DrawService,
		@Inject(MAT_DIALOG_DATA)
		public data: DialogData,
		private renderer: Renderer2,
	) {
		this.color = this.drawService.getColor(data.tool, data.type);
		this.newColor = this.color!;
	}

	public ngAfterViewInit(): void {
		const presetArea = document.querySelector(".preset-area");
		const colorActions = document.querySelector(".color__actions");
		if (presetArea && colorActions) {
			this.renderer.appendChild(colorActions, presetArea);
		}
	}

	public onClose(status: string): void {
		if (status === "accept") {
			if (this.newColor.indexOf("rgba") === -1) {
				this.newColor = this.newColor
					.replace("rgb", "rgba")
					.replace(")", ", 1)");
			}
			if (
				this.data.tool === Tools.Polygon ||
				this.data.tool === Tools.Figure ||
				this.data.tool === Tools.FreePolygon
			) {
				this.drawService.setColor(
					this.newColor,
					this.data.tool,
					this.data.type,
				);
			} else this.drawService.setColor(this.newColor, this.data.tool);
		}
		this.dialogRef.close(this.newColor);
	}

	public onColorChange(newColor: string) {
		this.newColor = this.limitAlphaChannel(newColor);
	}

	private limitAlphaChannel(color: string): string {
		const rgba = this.extractRgba(color);
		const alpha = Math.min(rgba[3], this.drawService.getAlpha(this.data.tool));

		return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${alpha})`;
	}

	private extractRgba(color: string): Array<number> {
		const rgbaRegex = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)$/;
		const rgbRegex = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;

		let match = rgbaRegex.exec(color);
		if (match) {
			return [
				parseInt(match[1], 10),
				parseInt(match[2], 10),
				parseInt(match[3], 10),
				this.drawService.getAlpha(this.data.tool),
			];
		}
		match = rgbRegex.exec(color);
		if (match) {
			return [
				parseInt(match[1], 10),
				parseInt(match[2], 10),
				parseInt(match[3], 10),
				1,
			];
		}
		return [0, 0, 0, 1];
	}
}
