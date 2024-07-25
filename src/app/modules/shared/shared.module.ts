import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoordinateSystemComponent } from "./shared-components/coordinate-system-selector/coordinate-system.component";
import { ExplanationComponent } from "./shared-components/explanation/explanation.component";
import { TranslocoRootModule } from "./transloco/transloco-root.module";
import { NumbersDirective } from "./directives/number/number.directive";
import { NotificationComponent } from "./shared-components/notification/notification.component";
import { TranslocoTestingModule } from "@ngneat/transloco";

@NgModule({
	declarations: [
		CoordinateSystemComponent,
		ExplanationComponent,
		NumbersDirective,
		NotificationComponent,
	],
	imports: [CommonModule, TranslocoRootModule, TranslocoTestingModule],
	exports: [
		CoordinateSystemComponent,
		TranslocoRootModule,
		ExplanationComponent,
		NumbersDirective,
		NotificationComponent,
	],
})
export class SharedModule {}
