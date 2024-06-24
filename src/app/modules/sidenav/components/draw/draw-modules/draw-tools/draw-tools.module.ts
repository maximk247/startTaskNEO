import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DrawOptionsModule } from "../draw-options/draw-options.module";
import { MatSliderModule } from "@angular/material/slider";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "src/app/modules/shared/shared.module";
import { InlineSVGModule } from "ng-inline-svg-2";
import { DrawFigureComponent } from "./components/draw-figure/draw-figure.component";
import { DrawFreeLineComponent } from "./components/draw-free-line/draw-free-line.component";
import { DrawFreePolygonComponent } from "./components/draw-free-polygon/draw-free-polygon.component";
import { DrawLineComponent } from "./components/draw-line/draw-line.component";
import { DrawPointComponent } from "./components/draw-point/draw-point.component";
import { DrawPolygonComponent } from "./components/draw-polygon/draw-polygon.component";

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
