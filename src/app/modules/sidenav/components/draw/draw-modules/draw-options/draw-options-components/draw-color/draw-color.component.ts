import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "src/app/modules/shared/shared-components/dialog/dialog.component";
import { DrawService } from "../../../../draw.service";
import { Subscription } from "rxjs";
import { ColorService } from "./draw-color.service";

@Component({
	selector: "app-draw-color",
	templateUrl: "./draw-color.component.html",
	styleUrls: ["./draw-color.component.scss"],
})
export class DrawColorComponent implements OnInit {
	@Input() public tool: string;
	@Input() public color: string;
	@Input() public type: string;
	public backgroundColor: string | undefined;
	private colorSubscription: Subscription;
	public constructor(
		private dialog: MatDialog,
		private drawService: DrawService,
		private colorService: ColorService,
	) {}

	public ngOnInit() {
		this.colorSubscription = this.colorService.color$.subscribe((color) => {
			this.backgroundColor = color;
		});
		this.backgroundColor = this.drawService.getColor("drawPoint");
	}

	public openColorDialog(): void {
		const dialogRef = this.dialog.open(DialogComponent, {
			disableClose: true,
			data: {
				tool: this.tool,
				color: this.color,
				type: this.type,
			},
		});
		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.color = result;
				this.updateBackgroundColor();
			}
		});
	}
	public updateBackgroundColor(): void {
		this.backgroundColor = this.color;
	}
}
