import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DialogComponent } from "./dialog.component";
import { ColorPickerModule } from "ngx-color-picker";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { TranslocoModule } from "@ngneat/transloco";

@NgModule({
	declarations: [DialogComponent],
	imports: [
		CommonModule,
		ColorPickerModule,
		FormsModule,
		MatDialogModule,
		MatMenuModule,
		TranslocoModule,
	],
	exports: [DialogComponent],
})
export class DialogModule {}
