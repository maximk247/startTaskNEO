import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MeasurementComponent } from "./measurement.component";

import { FormsModule } from "@angular/forms";
import { PointComponent } from "./geometry/point/point.component";
import { LineComponent } from "./geometry/line/line.component";
import { PolygonComponent } from "./geometry/polygon/polygon.component";
import { CircleComponent } from "./geometry/circle/circle.component";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
	declarations: [
		MeasurementComponent,
		PointComponent,
		LineComponent,
		PolygonComponent,
		CircleComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		MatSelectModule,
		MatFormFieldModule,
		MatInputModule,
		SharedModule,
	],
	exports: [MeasurementComponent],
})
export class MeasurementModule {}
