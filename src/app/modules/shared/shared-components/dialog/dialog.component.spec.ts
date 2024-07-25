import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DialogComponent } from "./dialog.component";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DrawService } from "src/app/modules/sidenav/components/draw/draw.service";
import { Renderer2 } from "@angular/core";
import { Tools } from "src/app/modules/sidenav/components/draw/enum/draw.enum";
import { DialogData } from "./interfaces/dialog.interface";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { getTranslocoModule } from "../../transloco/transloco-testing.module";

describe("DialogComponent", () => {
	let component: DialogComponent;
	let fixture: ComponentFixture<DialogComponent>;
	let dialogRefMock: any;
	let drawServiceMock: any;
	let rendererMock: jasmine.SpyObj<Renderer2>;
	let data: DialogData;

	beforeEach(async () => {
		dialogRefMock = {
			close: jasmine.createSpy("close"),
		};

		drawServiceMock = {
			getColor: jasmine
				.createSpy("getColor")
				.and.returnValue("rgba(255, 0, 0, 1)"),
			setColor: jasmine.createSpy("setColor"),
			getAlpha: jasmine.createSpy("getAlpha").and.returnValue(1),
		};

		rendererMock = jasmine.createSpyObj<Renderer2>("Renderer2", [
			"appendChild",
		]);

		data = {
			tool: Tools.Polygon,
			type: "fill",
			color: "rgba(255, 0, 0, 1)",
		};

		await TestBed.configureTestingModule({
			declarations: [DialogComponent],
			providers: [
				{ provide: MatDialogRef, useValue: dialogRefMock },
				{ provide: DrawService, useValue: drawServiceMock },
				{ provide: Renderer2, useValue: rendererMock },
				{ provide: MAT_DIALOG_DATA, useValue: data },
			],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [getTranslocoModule()],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize color correctly", () => {
		expect(component.color).toBe("rgba(255, 0, 0, 1)");
		expect(component.newColor).toBe("rgba(255, 0, 0, 1)");
	});

	it("should append preset area to color actions on ngAfterViewInit", () => {
		const presetArea = document.createElement("div");
		const colorActions = document.createElement("div");

		spyOn(document, "querySelector").and.returnValues(presetArea, colorActions);
		spyOn((component as any).renderer, "appendChild").and.callThrough();

		component.ngAfterViewInit();

		expect((component as any).renderer.appendChild).toHaveBeenCalledOnceWith(
			colorActions,
			presetArea,
		);
	});

	it("should update color and close dialog on accept", () => {
		component.onClose("accept");
		expect(drawServiceMock.setColor).toHaveBeenCalledWith(
			"rgba(255, 0, 0, 1)",
			data.tool,
			data.type,
		);
		expect(dialogRefMock.close).toHaveBeenCalledWith("rgba(255, 0, 0, 1)");
	});

	it("should close dialog with current color on cancel", () => {
		component.onClose("cancel");
		expect(dialogRefMock.close).toHaveBeenCalledWith("rgba(255, 0, 0, 1)");
	});

	it("should change color", () => {
		const newColor = "rgba(0, 255, 0, 1)";
		component.onColorChange(newColor);
		expect(component.newColor).toBe(newColor);
	});

	it("should limit alpha channel", () => {
		const color = "rgba(0, 255, 0, 0.5)";
		const limitedColor = (component as any).limitAlphaChannel(color);
		expect(limitedColor).toBe("rgba(0, 255, 0, 1)");
	});

	it("should extract rgba from color string", () => {
		const color = "rgba(0, 255, 0, 1)";
		const rgba = (component as any).extractRgba(color);
		expect(rgba).toEqual([0, 255, 0, 1]);
	});
});
