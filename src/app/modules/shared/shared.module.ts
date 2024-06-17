import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoordinateSystemComponent } from "./components/coordinate-system-selector/coordinate-system.component";
import { TranslocoRootModule } from "./transloco/transloco-root.module";
import { ExplanationComponent } from "./components/explanation/explanation.component";

@NgModule({
	declarations: [CoordinateSystemComponent, ExplanationComponent],
	imports: [CommonModule, TranslocoRootModule, ],
	exports: [
		CoordinateSystemComponent,
		TranslocoRootModule,
		ExplanationComponent,
	],
})
export class SharedModule {}
