import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DrawColorComponent } from "./draw-color/draw-color.component";
import { DrawShapeComponent } from "./draw-shape/draw-shape.component";
import { DrawSizeComponent } from "./draw-size/draw-size.component";
import { DrawTransparencyComponent } from "./draw-transparency/draw-transparency.component";
import { TranslocoModule } from "@ngneat/transloco";
import { FormsModule } from "@angular/forms";
import { MatSliderModule } from "@angular/material/slider";

@NgModule({
	declarations: [
		DrawColorComponent,
		DrawShapeComponent,
		DrawSizeComponent,
		DrawTransparencyComponent,
	],
	imports: [CommonModule, TranslocoModule, FormsModule, MatSliderModule],
	exports: [
		DrawColorComponent,
		DrawShapeComponent,
		DrawSizeComponent,
		DrawTransparencyComponent,
	],
})
export class DrawOptionsModule {}
