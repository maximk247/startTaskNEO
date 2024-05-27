import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalComponent } from "./modal.component";
import { TranslocoModule } from "@ngneat/transloco";
import { SidenavModule } from "../sidenav/sidenav.module";
import { InlineSVGModule } from "ng-inline-svg-2";
import { CdkDrag, DragDropModule } from "@angular/cdk/drag-drop";

@NgModule({
	declarations: [ModalComponent],
	imports: [
		CommonModule,
		TranslocoModule,
		SidenavModule,
		InlineSVGModule.forRoot({
			baseUrl: "../../../assets/images/",
		}),
		CdkDrag,
		DragDropModule,
	],
	exports: [ModalComponent],
})
export class ModalModule {}
