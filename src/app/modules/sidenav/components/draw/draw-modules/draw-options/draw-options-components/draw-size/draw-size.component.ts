import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "app-draw-size",
	templateUrl: "./draw-size.component.html",
	styleUrls: ["./draw-size.component.scss"],
})
export class DrawSizeComponent {
	@Input() public size: number | undefined;
	@Output() public sizeChange: EventEmitter<number> =
		new EventEmitter<number>();

	private minSize = 1;

	public updateSize() {
		if (this.size !== undefined) {
			this.size = +this.size;
			this.sizeChange.emit(this.size);
		}
	}

	public decreaseSize() {
		if (this.size) {
			if (this.size > this.minSize) {
				this.size--;
				this.updateSize();
			}
		}
	}

	public increaseSize() {
		if (this.size) {
			this.size++;
			this.updateSize();
		}
	}
}
