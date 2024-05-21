import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenuComponent } from "./menu.component";
import { TranslocoModule } from "@ngneat/transloco";

@NgModule({
	declarations: [MenuComponent],
	imports: [CommonModule, TranslocoModule],
	exports: [MenuComponent],
})
export class MenuModule {}
