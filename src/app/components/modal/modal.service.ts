import { Injectable } from "@angular/core";
import { ModalMode } from "./interfaces/modal.interface";

@Injectable({
	providedIn: "root",
})
export class ModalService {
	public updateBoundarySize(
		mode: ModalMode,
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
