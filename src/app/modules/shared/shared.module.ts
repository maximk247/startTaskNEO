import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoordinateSystemComponent } from "./shared-components/coordinate-system-selector/coordinate-system.component";
import { ExplanationComponent } from "./shared-components/explanation/explanation.component";
import { TranslocoRootModule } from "./transloco/transloco-root.module";

@NgModule({
	declarations: [CoordinateSystemComponent, ExplanationComponent],
	imports: [CommonModule, TranslocoRootModule],
	exports: [
		CoordinateSystemComponent,
		TranslocoRootModule,
		ExplanationComponent,
	],
})
export class SharedModule {}
