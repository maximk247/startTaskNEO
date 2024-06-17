import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DrawFigureComponent } from "./draw-figure/draw-figure.component";
import { DrawFreeLineComponent } from "./draw-free-line/draw-free-line.component";
import { DrawFreePolygonComponent } from "./draw-free-polygon/draw-free-polygon.component";
import { DrawLineComponent } from "./draw-line/draw-line.component";
import { DrawPointComponent } from "./draw-point/draw-point.component";
import { DrawPolygonComponent } from "./draw-polygon/draw-polygon.component";

import { DrawOptionsModule } from "../draw-options/draw-options.module";
import { MatSliderModule } from "@angular/material/slider";

import { FormsModule } from "@angular/forms";
import { SharedModule } from "src/app/modules/shared/shared.module";
import { InlineSVGModule } from "ng-inline-svg-2";

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
		SharedModule,
		DrawOptionsModule,
		MatSliderModule,
		FormsModule,
		InlineSVGModule.forRoot({
			baseUrl: "/assets/images/",
		}),
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
