import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MenuComponent } from "./modules/menu/menu.component";
import { MeasurementComponent } from "./modules/measurement/measurement.component";
import { DrawComponent } from "./modules/draw/draw.component";
import { CoordinatesComponent } from "./modules/coordinates/coordinates.component";
import { MeasurementModule } from "./modules/measurement/measurement.module";
import { MenuModule } from "./modules/menu/menu.module";
import { DrawModule } from "./modules/draw/draw.module";
import { CoordinatesModule } from "./modules/coordinates/coordinates.module";

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
