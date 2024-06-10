import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DrawDeleteComponent } from "./draw-delete/draw-delete.component";
import { SharedModule } from "src/app/modules/shared/shared.module";

@NgModule({
	declarations: [DrawDeleteComponent],
	imports: [CommonModule, SharedModule],
	exports: [DrawDeleteComponent],
})
export class DrawEditingModule {}
