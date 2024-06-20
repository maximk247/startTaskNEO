import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DrawDeleteModule } from "./draw-delete/draw-delete.module";

@NgModule({
	declarations: [],
	imports: [CommonModule, DrawDeleteModule],
	exports: [DrawDeleteModule],
})
export class DrawEditingModule {}
