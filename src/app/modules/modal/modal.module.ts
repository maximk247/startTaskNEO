import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalComponent } from "./modal.component";
import { SidenavModule } from "../sidenav/sidenav.module";
import { InlineSVGModule } from "ng-inline-svg-2";
import { CdkDrag, DragDropModule } from "@angular/cdk/drag-drop";
import { SharedModule } from "../shared/shared.module";

@NgModule({
	declarations: [ModalComponent],
	imports: [
		CommonModule,
		SharedModule,
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
