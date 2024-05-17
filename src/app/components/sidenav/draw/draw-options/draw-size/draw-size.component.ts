import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "app-draw-size",
	templateUrl: "./draw-size.component.html",
	styleUrls: ["./draw-size.component.scss"],
})
export class DrawSizeComponent {
	@Input() size: number | undefined;
	@Input() name: string;
	@Output() sizeChange: EventEmitter<number> = new EventEmitter<number>();

	updateSize() {
		this.sizeChange.emit(this.size);
	}

	decreaseSize() {
		if(this.size){
			if (this.size > 1) {
				this.size--;
				this.updateSize();
			}
		}
		
	}

	increaseSize() {
		if(this.size) {
			this.size++;
			this.updateSize();
		}
		
	}
}
