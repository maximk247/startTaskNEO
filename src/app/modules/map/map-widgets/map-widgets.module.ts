import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TranslocoModule } from "@ngneat/transloco";
import { InlineSVGModule } from "ng-inline-svg-2";
import { ControlsComponent } from "./controls/controls.component";
import { ScaleBarComponent } from "./scale-bar/scale-bar.component";
import { SliderComponent } from "./slider/slider.component";

@NgModule({
	declarations: [ControlsComponent, ScaleBarComponent, SliderComponent],
	imports: [
		CommonModule,
		TranslocoModule,
		InlineSVGModule.forRoot({
			baseUrl: "../../../assets/images/",
		}),
	],
	exports: [ControlsComponent, ScaleBarComponent, SliderComponent],
})
export class MapWidgetsModule {}
