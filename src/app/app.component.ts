import { Component } from "@angular/core";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	menuMode: "menu" | "draw" | "coordinates" | "measurement" | null;

	isWindowVisible = false;

	toggleWindow(mode: "menu" | "draw" | "coordinates" | "measurement") {
		this.isWindowVisible = !this.isWindowVisible;
		if (this.menuMode !== mode) {
			this.menuMode = mode;
			setTimeout(() => {
				this.isWindowVisible = true;
			}, 100);
		}
	}
	getButtonClass(
		mode: "menu" | "draw" | "coordinates" | "measurement",
	): string {
		return this.menuMode === mode && this.isWindowVisible ? "active" : "";
	}
}
