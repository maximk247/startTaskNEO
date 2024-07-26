import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ModalComponent } from "./modal.component";
import { ModalService } from "./modal.service";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { getTranslocoModule } from "../shared/transloco/transloco-testing.module";

describe("ModalComponent", () => {
	let component: ModalComponent;
	let fixture: ComponentFixture<ModalComponent>;
	let modalServiceMock: any;

	beforeEach(async () => {
		modalServiceMock = {
			updateBoundarySize: jasmine.createSpy("updateBoundarySize"),
		};

		await TestBed.configureTestingModule({
			declarations: [ModalComponent],
			providers: [{ provide: ModalService, useValue: modalServiceMock }],
			imports: [getTranslocoModule()],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalComponent);
		component = fixture.componentInstance;
		component.mode = "menu";
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should call updateBoundarySize on ngAfterContentChecked", () => {
		component.ngAfterContentChecked();
		expect(modalServiceMock.updateBoundarySize).toHaveBeenCalledWith(
			component.mode,
		);
	});

	it("should set isVisible to false and emit visibleChange on cancelModal", () => {
		spyOn(component.visibleChange, "emit");
		component.cancelModal();
		expect(component.isVisible).toBeFalse();
		expect(component.visibleChange.emit).toHaveBeenCalledWith(false);
	});

	it("should call updateBoundarySize on window resize", () => {
		window.dispatchEvent(new Event("resize"));
		expect(modalServiceMock.updateBoundarySize).toHaveBeenCalledWith(
			component.mode,
		);
	});
});
