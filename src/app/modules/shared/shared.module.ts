import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoordinateSystemComponent } from "./coordinate-system-selector/coordinate-system.component";
import { TranslocoRootModule } from "./transloco/transloco-root.module";

@NgModule({
	declarations: [CoordinateSystemComponent],
	imports: [CommonModule, TranslocoRootModule],
	exports: [CoordinateSystemComponent, TranslocoRootModule],
})
export class SharedModule {}
