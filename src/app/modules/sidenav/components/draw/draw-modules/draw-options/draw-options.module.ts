import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DrawShapeComponent } from "./draw-options-components/draw-shape/draw-shape.component";
import { DrawSizeComponent } from "./draw-options-components/draw-size/draw-size.component";

import { FormsModule } from "@angular/forms";
import { MatSliderModule } from "@angular/material/slider";

import { SharedModule } from "src/app/modules/shared/shared.module";
import { DrawCoordinateInputComponent } from "./draw-options-components/draw-coordinate-input/draw-coordinate-input.component";
import { DrawTransparencyComponent } from "./draw-options-components/draw-transparency/draw-transparency.component";
import { InlineSVGModule } from "ng-inline-svg-2";
import { DrawColorComponent } from "./draw-options-components/draw-color/draw-color.component";

@NgModule({
	declarations: [
		DrawColorComponent,
		DrawShapeComponent,
		DrawSizeComponent,
		DrawTransparencyComponent,
		DrawCoordinateInputComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		MatSliderModule,
		SharedModule,
		InlineSVGModule.forRoot({
			baseUrl: "/assets/images/",
		}),
	],
	exports: [
		DrawColorComponent,
		DrawShapeComponent,
		DrawSizeComponent,
		DrawTransparencyComponent,
		DrawCoordinateInputComponent,
	],
})
export class DrawOptionsModule {}
