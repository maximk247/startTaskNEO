import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DrawComponent } from "./draw.component";
import { DrawToolsModule } from "./modules/draw-tools/draw-tools.module";
import { DrawOptionsModule } from "./modules/draw-options/draw-options.module";
import { DrawEditingModule } from "./modules/draw-editing/draw-editing.module";
import { DialogModule } from "./modules/dialog/dialog.module";
import { InlineSVGModule } from "ng-inline-svg-2";

@NgModule({
	declarations: [DrawComponent],
	imports: [
		CommonModule,
		DrawToolsModule,
		DrawOptionsModule,
		DrawEditingModule,
		DialogModule,
		InlineSVGModule.forRoot({
			baseUrl: "/assets/images/",
		}),
	],
	exports: [DrawComponent],
})
export class DrawModule {}
