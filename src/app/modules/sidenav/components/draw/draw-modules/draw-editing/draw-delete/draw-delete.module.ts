import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DrawDeleteAllComponent } from "./components/draw-delete-all/draw-delete-all.component";
import { InlineSVGModule } from "ng-inline-svg-2";
import { SharedModule } from "src/app/modules/shared/shared.module";
import { DrawDeleteOnClickComponent } from "./components/draw-delete-on-click/draw-delete-on-click.component";

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
