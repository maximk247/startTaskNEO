import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MeasurementComponent } from "./measurement.component";
import { TranslocoModule } from "@ngneat/transloco";
import { FormsModule } from "@angular/forms";
import { PointComponent } from './geometry/point/point.component';
import { LineComponent } from './geometry/line/line.component';
import { PolygonComponent } from './geometry/polygon/polygon.component';
import { CircleComponent } from './geometry/circle/circle.component';

@NgModule({
	declarations: [MeasurementComponent, PointComponent, LineComponent, PolygonComponent, CircleComponent],
	imports: [CommonModule, TranslocoModule, FormsModule],
	exports: [MeasurementComponent],
})
export class MeasurementModule {}
