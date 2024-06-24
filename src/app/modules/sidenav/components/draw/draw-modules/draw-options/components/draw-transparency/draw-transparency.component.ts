import { Component, Input, OnDestroy, OnInit } from "@angular/core";

import { Subscription } from "rxjs";
import { ColorType } from "../../../../enum/draw.enum";
import { DrawService } from "../../../../draw.service";
import { ColorService } from "../draw-color/draw-color.service";

@Component({
	selector: "app-draw-transparency",
	templateUrl: "./draw-transparency.component.html",
	styleUrls: ["./draw-transparency.component.scss"],
})
export class DrawTransparencyComponent implements OnInit, OnDestroy {
	@Input() public tool: string;
	@Input() public type: string;
	public alphaValue: number;
	private alphaSubscription: Subscription;
	private currentColor: string | undefined;
	public constructor(
		private drawService: DrawService,
		private colorService: ColorService,
	) {}

	public ngOnInit() {
		this.alphaValue = this.drawService.getAlpha(this.tool);
		this.currentColor = this.drawService.getColor(this.tool, this.type);
		this.alphaSubscription = this.drawService.alphaChanged.subscribe(
			(alpha) => {
				this.alphaValue = alpha;
			},
		);
	}
	public updateColorWithAlpha() {
		this.currentColor =
			this.drawService.getColor(this.tool, this.type) || "rgba(0, 0, 0, 1)";
		const updatedColor = this.replaceAlpha(this.currentColor, this.alphaValue);
		this.drawService.setColor(updatedColor, this.tool, this.type);
		this.colorService.setColor(updatedColor);
	}

	private replaceAlpha(color: string, alpha: number): string {
		const regex = /rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+(\.\d+)?)\)/g;
		return color.replace(regex, `rgba($1, $2, $3, ${alpha})`);
	}

	public formatSliderValue(value: number) {
		return (value * 100).toFixed(0) + "%";
	}

	public ngOnDestroy() {
		this.alphaSubscription.unsubscribe();
	}
}
