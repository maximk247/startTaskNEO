import { AfterViewInit, Directive, OnDestroy } from "@angular/core";
import { DragDrop, DragRef } from "@angular/cdk/drag-drop";

@Directive({
	selector: "[appDraggableDialog]",
})
export class DraggableDialogDirective implements OnDestroy, AfterViewInit {
	private dragRef: DragRef;

	public constructor(private dragDrop: DragDrop) {}

	public ngAfterViewInit() {
		const dialogBoundary = document.querySelector("mat-dialog-container");
		const dialogContainer = document.querySelector(".mdc-dialog__surface");
		if (dialogContainer) {
			this.dragRef = this.dragDrop.createDrag(dialogContainer as HTMLElement);
			this.dragRef.withBoundaryElement(dialogBoundary as HTMLElement);
			const dragHandle = dialogContainer.querySelector(
				".dialog-container__header",
			);
			if (dragHandle) {
				this.dragRef.withHandles([dragHandle as HTMLElement]);
			}
		}
	}

	public ngOnDestroy() {
		if (this.dragRef) {
			this.dragRef.dispose();
		}
	}
}
