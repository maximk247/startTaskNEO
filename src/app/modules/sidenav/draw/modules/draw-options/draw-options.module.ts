import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DrawColorComponent } from "./draw-color/draw-color.component";
import { DrawShapeComponent } from "./draw-shape/draw-shape.component";
import { DrawSizeComponent } from "./draw-size/draw-size.component";
import { DrawTransparencyComponent } from "./draw-transparency/draw-transparency.component";
import { FormsModule } from "@angular/forms";
import { MatSliderModule } from "@angular/material/slider";
import { DrawCoordinateInputComponent } from "./draw-coordinate-input/draw-coordinate-input.component";
import { SharedModule } from "src/app/modules/shared/shared.module";

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
