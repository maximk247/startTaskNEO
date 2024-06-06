import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DrawFigureComponent } from "./draw-figure/draw-figure.component";
import { DrawFreeLineComponent } from "./draw-free-line/draw-free-line.component";
import { DrawFreePolygonComponent } from "./draw-free-polygon/draw-free-polygon.component";
import { DrawLineComponent } from "./draw-line/draw-line.component";
import { DrawPointComponent } from "./draw-point/draw-point.component";
import { DrawPolygonComponent } from "./draw-polygon/draw-polygon.component";
import { TranslocoModule } from "@ngneat/transloco";

import { DrawOptionsModule } from "../draw-options/draw-options.module";
import { MatSliderModule } from "@angular/material/slider";

import { FormsModule } from "@angular/forms";

@NgModule({
	declarations: [
		DrawFigureComponent,
		DrawFreeLineComponent,
		DrawFreePolygonComponent,
		DrawLineComponent,
		DrawPointComponent,
		DrawPolygonComponent,
	],
	imports: [
		CommonModule,
		TranslocoModule,
		DrawOptionsModule,
		MatSliderModule,
		FormsModule,
	],
	exports: [
		DrawFigureComponent,
		DrawFreeLineComponent,
		DrawFreePolygonComponent,
		DrawLineComponent,
		DrawPointComponent,
		DrawPolygonComponent,
	],
})
export class DrawToolsModule {}