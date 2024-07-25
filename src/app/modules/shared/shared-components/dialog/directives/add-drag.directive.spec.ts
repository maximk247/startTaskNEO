import { DragDrop, DragRef } from "@angular/cdk/drag-drop";
import { Component, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DraggableDialogDirective } from "./add-drag.directive";

@Component({
	template: `<div class="mdc-dialog__surface" appDraggableDialog>
		<div class="dialog-container__header"></div>
	</div>`,
})
class TestComponent {}

describe("DraggableDialogDirective", () => {
	let fixture: ComponentFixture<TestComponent>;
	let directive: DraggableDialogDirective;
	let dragDropSpy: jasmine.SpyObj<DragDrop>;
	let dragRefSpy: jasmine.SpyObj<DragRef>;

	beforeEach(() => {
		const dragRef = jasmine.createSpyObj("DragRef", [
			"withBoundaryElement",
			"withHandles",
			"dispose",
		]);
		const dragDrop = jasmine.createSpyObj("DragDrop", ["createDrag"]);

		TestBed.configureTestingModule({
			declarations: [TestComponent, DraggableDialogDirective],
			providers: [{ provide: DragDrop, useValue: dragDrop }],
		}).compileComponents();

		dragDropSpy = TestBed.inject(DragDrop) as jasmine.SpyObj<DragDrop>;
		dragDropSpy.createDrag.and.returnValue(dragRef);
		dragRefSpy = dragRef as jasmine.SpyObj<DragRef>;

		fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		const directiveEl: DebugElement = fixture.debugElement.query(
			By.directive(DraggableDialogDirective),
		);
		directive = directiveEl.injector.get(
			DraggableDialogDirective,
		) as DraggableDialogDirective;
	});

	it("should create an instance", () => {
		expect(directive).toBeTruthy();
	});

	it("should initialize DragRef with correct boundary and handle", () => {
		const dialogBoundary = document.querySelector("mat-dialog-container");
		const dialogContainer = document.querySelector(".mdc-dialog__surface");
		const dragHandle = dialogContainer?.querySelector(
			".dialog-container__header",
		);

		expect(dragDropSpy.createDrag).toHaveBeenCalledWith(
			dialogContainer as HTMLElement,
		);
		expect(dragRefSpy.withBoundaryElement).toHaveBeenCalledWith(
			dialogBoundary as HTMLElement,
		);
		expect(dragRefSpy.withHandles).toHaveBeenCalledWith([
			dragHandle as HTMLElement,
		]);
	});

	it("should dispose DragRef on destroy", () => {
		directive.ngOnDestroy();
		expect(dragRefSpy.dispose).toHaveBeenCalled();
	});
});
