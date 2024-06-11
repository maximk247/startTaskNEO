import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoordinatesComponent } from "./coordinates.component";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
	declarations: [CoordinatesComponent],
	imports: [CommonModule, FormsModule, SharedModule, MatButtonModule],
	exports: [CoordinatesComponent],
})
export class CoordinatesModule {}
