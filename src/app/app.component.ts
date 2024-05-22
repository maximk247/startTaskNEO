import { Component } from "@angular/core";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	public menuMode: "menu" | "draw" | "coordinates" | "measurement" | null;

	public isWindowVisible = false;

	public toggleWindow(mode: "menu" | "draw" | "coordinates" | "measurement") {
		this.isWindowVisible = !this.isWindowVisible;
		if (this.menuMode !== mode) {
			this.menuMode = mode;
			setTimeout(() => {
				this.isWindowVisible = true;
			}, 100);
		}
	}
	public getButtonClass(
		mode: "menu" | "draw" | "coordinates" | "measurement",
	): string {
		return this.menuMode === mode && this.isWindowVisible ? "active" : "";
	}
}
