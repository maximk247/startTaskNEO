import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MapComponent } from "./map.component";
import { ControlsComponent } from "./map-widgets/controls/controls.component";
import { ScaleBarComponent } from "./map-widgets/scale-bar/scale-bar.component";
import { SliderComponent } from "./map-widgets/slider/slider.component";
import { TranslocoModule } from "@ngneat/transloco";
import { InlineSVGModule } from "ng-inline-svg-2";

@NgModule({
	declarations: [
		MapComponent,
		ControlsComponent,
		ScaleBarComponent,
		SliderComponent,
	],
	imports: [
		CommonModule,
		TranslocoModule,
		InlineSVGModule.forRoot({
			baseUrl: "../../../assets/images/",
		}),
	],
	exports: [
		MapComponent,
		ControlsComponent,
		ScaleBarComponent,
		SliderComponent,
	],
})
export class MapModule {}
