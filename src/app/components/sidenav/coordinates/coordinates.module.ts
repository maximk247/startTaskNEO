import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoordinatesComponent } from "./coordinates.component";
import { TranslocoModule } from "@ngneat/transloco";
import { FormsModule } from "@angular/forms";

@NgModule({
	declarations: [CoordinatesComponent],
	imports: [CommonModule, TranslocoModule, FormsModule],
	exports: [CoordinatesComponent],
})
export class CoordinatesModule {}
