import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { ColorPickerModule } from "ngx-color-picker";
import { SharedModule } from "src/app/modules/shared/shared.module";
import { DialogComponent } from "./dialog.component";
import { MatMenuModule } from "@angular/material/menu";
import { CdkDrag, DragDropModule } from "@angular/cdk/drag-drop";
import { DraggableDialogDirective } from "./directives/add-drag.directive";
import { InlineSVGModule } from "ng-inline-svg-2";

@NgModule({
	declarations: [DialogComponent, DraggableDialogDirective],
	imports: [
		MatMenuModule,
		CommonModule,
		ColorPickerModule,
		FormsModule,
		MatDialogModule,
		SharedModule,
		CdkDrag,
		DragDropModule,
		InlineSVGModule.forRoot({
			baseUrl: "/assets/images/",
		}),
	],
	exports: [DialogComponent],
})
export class DialogModule {}
