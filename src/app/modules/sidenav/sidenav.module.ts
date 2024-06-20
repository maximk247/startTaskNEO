import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MenuComponent } from "./components/menu/menu.component";
import { MeasurementComponent } from "./components/measurement/measurement.component";
import { DrawComponent } from "./components/draw/draw.component";
import { CoordinatesComponent } from "./components/coordinates/coordinates.component";
import { MeasurementModule } from "./components/measurement/measurement.module";
import { CoordinatesModule } from "./components/coordinates/coordinates.module";
import { DrawModule } from "./components/draw/draw.module";
import { MenuModule } from "./components/menu/menu.module";

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
