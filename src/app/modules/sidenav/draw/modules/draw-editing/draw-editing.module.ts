import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DrawDeleteComponent } from "./draw-delete/draw-delete.component";
import { SharedModule } from "src/app/modules/shared/shared.module";
import { InlineSVGModule } from "ng-inline-svg-2";

@NgModule({
	declarations: [DrawDeleteComponent],
	imports: [
		CommonModule,
		SharedModule,
		InlineSVGModule.forRoot({
			baseUrl: "/assets/images/",
		}),
	],
	exports: [DrawDeleteComponent],
})
export class DrawEditingModule {}
