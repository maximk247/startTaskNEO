import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, of } from "rxjs";
import { DrawService } from "../../../../draw.service";
import { ColorType, Tools } from "../../../../enum/draw.enum";
import { DrawColorComponent } from "./draw-color.component";
import { ColorService } from "./draw-color.service";

describe("DrawColorComponent", () => {
	let component: DrawColorComponent;
	let fixture: ComponentFixture<DrawColorComponent>;
	let mockMatDialog: jasmine.SpyObj<MatDialog>;
	let mockDrawService: jasmine.SpyObj<DrawService>;
	let mockColorService: ColorService;

	beforeEach(waitForAsync(() => {
		const matDialogRefMock = jasmine.createSpyObj("MatDialogRef", [
			"afterClosed",
			"_containerInstance",
		]);
		const matDialogSpy = jasmine.createSpyObj("MatDialog", ["open"]);
		const drawServiceSpy = jasmine.createSpyObj("DrawService", [
			"splitRgbaColors",
			"getColor",
		]);
		const colorService = new ColorService();

		TestBed.configureTestingModule({
			declarations: [DrawColorComponent],
			providers: [
				{ provide: MatDialog, useValue: matDialogSpy },
				{ provide: DrawService, useValue: drawServiceSpy },
				{ provide: ColorService, useValue: colorService },
			],
		}).compileComponents();

		mockMatDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
		mockDrawService = TestBed.inject(
			DrawService,
		) as jasmine.SpyObj<DrawService>;
		mockColorService = TestBed.inject(ColorService);

		matDialogSpy.open.and.returnValue(matDialogRefMock);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DrawColorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should update background color on color change", () => {
		const mockColor = "#ff0000";
		const mockResult = "#00ff00";

		const dialogRefMock = jasmine.createSpyObj("MatDialogRef", ["afterClosed"]);
		dialogRefMock.afterClosed.and.returnValue(of(mockResult));
		mockMatDialog.open.and.returnValue(dialogRefMock);

		component.color = mockColor;
		component.type = ColorType.Stroke;

		component.openColorDialog();

		expect(component.color).toEqual(mockResult);
		expect(component.backgroundColor).toEqual(mockResult);
	});

	afterEach(() => {
		fixture.destroy();
	});
});
