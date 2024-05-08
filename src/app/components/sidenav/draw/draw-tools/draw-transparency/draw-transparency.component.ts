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
	alphaValue: number;
	redValue: number;
	greenValue: number;
	blueValue: number;
	colorSubscription: Subscription;
	constructor(private drawService: DrawService) {}

	ngOnInit() {
		let color = this.drawService.getColor();
		switch (this.tool) {
			case "drawPoint":
				color = this.drawService.getPointColor();
				break;
			case "drawLine":
				color = this.drawService.getLineColor();
		}
		console.log(color);
		this.updateColorValues(color);
		this.colorSubscription = this.drawService.colorChanged.subscribe(
			(color) => {
				this.updateColorValues(color);
			},
		);
	}

	updateColorValues(colorString: string) {
		if (colorString) {
			const rgbaValues = colorString
				.replace("rgba(", "")
				.replace(")", "")
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
		console.log(rgbaColor, this.tool);
		this.drawService.setColor(rgbaColor, this.tool);
	}

	formatSliderValue(value: number) {
		return (value * 100).toFixed(0) + "%";
	}

	ngOnDestroy() {
		this.colorSubscription.unsubscribe();
	}
}
