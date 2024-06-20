import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DrawComponent } from "./draw.component";

import { InlineSVGModule } from "ng-inline-svg-2";

import { DrawEditingModule } from "./draw-modules/draw-editing/draw-editing.module";
import { DrawOptionsModule } from "./draw-modules/draw-options/draw-options.module";
import { DrawToolsModule } from "./draw-modules/draw-tools/draw-tools.module";
import { DialogModule } from "src/app/modules/shared/shared-components/dialog/dialog.module";

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
