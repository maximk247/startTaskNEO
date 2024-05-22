import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DrawDeleteComponent } from "./draw-delete/draw-delete.component";
import { TranslocoModule } from "@ngneat/transloco";

@NgModule({
	declarations: [DrawDeleteComponent],
	imports: [CommonModule, TranslocoModule],
	exports: [DrawDeleteComponent],
})
export class DrawEditingModule {}
