import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DrawDeleteAllComponent } from "./draw-delete-all/draw-delete-all.component";
import { DrawDeleteOnClickComponent } from "./draw-delete-on-click/draw-delete-on-click.component";
import { InlineSVGModule } from "ng-inline-svg-2";
import { SharedModule } from "src/app/modules/shared/shared.module";

@NgModule({
	declarations: [DrawDeleteOnClickComponent, DrawDeleteAllComponent],
	imports: [
		CommonModule,
		SharedModule,
		InlineSVGModule.forRoot({
			baseUrl: "/assets/images/",
		}),
	],
	exports: [DrawDeleteOnClickComponent, DrawDeleteAllComponent],
})
export class DrawDeleteModule {}
