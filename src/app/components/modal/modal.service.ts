import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class ModalService {
	updateBoundarySize(
		mode: "menu" | "draw" | "coordinates" | "measurement",
	): void {
		if (mode !== "menu") {
			const container = document.getElementsByClassName(
				"map",
			)[0] as HTMLElement;
			const boundary = document.querySelector(
				".box-boundary",
			) as HTMLDivElement;

			if (boundary) {
				boundary.style.width = `${container.clientWidth}px`;
				boundary.style.minHeight = `${container.clientHeight}px`;
			}
		}
	}
}
