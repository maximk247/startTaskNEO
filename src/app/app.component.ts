import { Component } from "@angular/core";
import { MenuMode } from "./interfaces/app.interface";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	public menuMode: MenuMode;

	public updateVisible(visible: boolean) {
		this.isWindowVisible = visible;
	}

	public isWindowVisible = false;

	public toggleWindow(mode: MenuMode) {
		this.isWindowVisible = !this.isWindowVisible;
		if (this.menuMode !== mode) {
			this.menuMode = mode;
			setTimeout(() => {
				this.isWindowVisible = true;
			}, 100);
		}
	}
	public getButtonClass(mode: MenuMode): string {
		return this.menuMode === mode && this.isWindowVisible ? "active" : "";
	}
}
