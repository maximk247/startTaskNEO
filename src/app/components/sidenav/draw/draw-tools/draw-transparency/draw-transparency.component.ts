import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { DrawService } from "../../draw.service";
import { Subscription } from "rxjs";
@Component({
	selector: "app-draw-transparency",
	templateUrl: "./draw-transparency.component.html",
	styleUrls: ["./draw-transparency.component.scss"],
})
export class TransparencyComponent implements OnInit, OnDestroy {
	@Input() tool: string;
	@Input() type: string;
	alphaValue: number;
	redValue: number;
	greenValue: number;
	blueValue: number;
	colorSubscription: Subscription;
	constructor(private drawService: DrawService) {}

	ngOnInit() {
		const color = this.drawService.getColor(this.tool);
		this.updateColorValues(color!);
		this.colorSubscription = this.drawService.colorChanged.subscribe(
			(color) => {
				this.updateColorValues(color);
			},
		);
	}

	updateColorValues(colorString: string) {
		if (colorString) {
			const regex = /rgba\((.*?)\)/g;
			const colors = [];
			let match;
			while ((match = regex.exec(colorString)) !== null) {
				colors.push(match[1]);
			}
			const rgbaValues = colors[0]
				.split(",")
				.map((value) => parseFloat(value.trim()));
			this.redValue = +rgbaValues[0]?.toFixed(2) || 0;
			this.greenValue = +rgbaValues[1]?.toFixed(2) || 0;
			this.blueValue = +rgbaValues[2]?.toFixed(2) || 0;
			this.alphaValue = +rgbaValues[3]?.toFixed(2) || 0;
		}
	}
	updateColorWithAlpha() {
		const rgbaColor = `rgba(${this.redValue}, ${this.greenValue}, ${this.blueValue}, ${this.alphaValue})`;
		if (this.type === "polygon") {
			this.drawService.setColor(`${this.alphaValue}`, this.tool, this.type);
		} else {
			this.drawService.setColor(rgbaColor, this.tool, this.type);
		}
	}

	formatSliderValue(value: number) {
		return (value * 100).toFixed(0) + "%";
	}

	ngOnDestroy() {
		this.colorSubscription.unsubscribe();
	}
}
