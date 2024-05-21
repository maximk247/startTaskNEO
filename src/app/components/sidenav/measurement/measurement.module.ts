import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MeasurementComponent } from "./measurement.component";
import { TranslocoModule } from "@ngneat/transloco";
import { FormsModule } from "@angular/forms";

@NgModule({
	declarations: [MeasurementComponent],
	imports: [CommonModule, TranslocoModule, FormsModule],
	exports: [MeasurementComponent],
})
export class MeasurementModule {}
