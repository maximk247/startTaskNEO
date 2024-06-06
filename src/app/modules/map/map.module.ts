import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MapComponent } from "./map.component";
import { MapWidgetsModule } from "./map-widgets/map-widgets.module";

@NgModule({
	declarations: [MapComponent],
	imports: [CommonModule, MapWidgetsModule],
	exports: [MapComponent],
})
export class MapModule {}
