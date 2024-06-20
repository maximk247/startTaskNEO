import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { ColorPickerModule } from "ngx-color-picker";
import { SharedModule } from "src/app/modules/shared/shared.module";
import { DialogComponent } from "./dialog.component";
import { MatMenuModule } from "@angular/material/menu";
import { TranslocoRootModule } from "../../transloco/transloco-root.module";

@NgModule({
	declarations: [DialogComponent],
	imports: [
		MatMenuModule,
		CommonModule,
		ColorPickerModule,
		FormsModule,
		MatDialogModule,
		TranslocoRootModule,
	],
	exports: [DialogComponent],
})
export class DialogModule {}
