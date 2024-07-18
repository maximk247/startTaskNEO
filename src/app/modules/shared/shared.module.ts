import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoordinateSystemComponent } from "./shared-components/coordinate-system-selector/coordinate-system.component";
import { ExplanationComponent } from "./shared-components/explanation/explanation.component";
import { TranslocoRootModule } from "./transloco/transloco-root.module";
import { TooltipComponent } from "./shared-components/tooltip/tooltip.component";
import { NumbersDirective } from "./directives/number/number.directive";
import { NotificationComponent } from "./shared-components/notification/notification.component";

@NgModule({
	declarations: [
		CoordinateSystemComponent,
		ExplanationComponent,
		TooltipComponent,
		NumbersDirective,
		NotificationComponent,
	],
	imports: [CommonModule, TranslocoRootModule],
	exports: [
		CoordinateSystemComponent,
		TranslocoRootModule,
		ExplanationComponent,
		TooltipComponent,
		NumbersDirective,
		NotificationComponent,
	],
})
export class SharedModule {}
