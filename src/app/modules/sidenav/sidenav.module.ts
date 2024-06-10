import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MenuComponent } from "./menu/menu.component";
import { MeasurementComponent } from "./measurement/measurement.component";
import { DrawComponent } from "./draw/draw.component";
import { CoordinatesComponent } from "./coordinates/coordinates.component";
import { MeasurementModule } from "./measurement/measurement.module";
import { MenuModule } from "./menu/menu.module";
import { DrawModule } from "./draw/draw.module";
import { CoordinatesModule } from "./coordinates/coordinates.module";

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		MeasurementModule,
		MenuModule,
		DrawModule,
		CoordinatesModule,
		
	],
	exports: [
		MenuComponent,
		MeasurementComponent,
		DrawComponent,
		CoordinatesComponent,
	],
})
export class SidenavModule {}
