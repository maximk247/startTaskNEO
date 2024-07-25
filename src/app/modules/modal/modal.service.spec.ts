import { TestBed } from "@angular/core/testing";
import { ModalService } from "./modal.service";
import { ModalMode } from "./interfaces/modal.interface";

describe("ModalService", () => {
	let service: ModalService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ModalService],
		});
		service = TestBed.inject(ModalService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});

	describe("updateBoundarySize", () => {
		let containerMock: HTMLElement;
		let boundaryMock: HTMLDivElement;
		let querySelectorSpy: jasmine.Spy;

		beforeEach(() => {
			containerMock = document.createElement("div");
			containerMock.className = "map";
			containerMock.style.width = "800px";
			containerMock.style.height = "600px";
			document.body.appendChild(containerMock);

			boundaryMock = document.createElement("div");
			boundaryMock.className = "box-boundary";
			document.body.appendChild(boundaryMock);

			spyOn(document, "getElementsByClassName").and.callFake(
				(className: string) => {
					if (className === "map") {
						const htmlCollection: HTMLCollectionOf<Element> = {
							0: containerMock,
							length: 1,
							item: (index: number) => (index === 0 ? containerMock : null),
							namedItem: (name: string) =>
								name === "map" ? containerMock : null,
						};
						return htmlCollection;
					}
					return document
						.createElement("div")
						.getElementsByClassName(className);
				},
			);

			querySelectorSpy = spyOn(document, "querySelector").and.callFake(
				(selector: string) => {
					if (selector === ".box-boundary") {
						return boundaryMock;
					}
					return null;
				},
			);
		});

		afterEach(() => {
			document.body.removeChild(containerMock);
			document.body.removeChild(boundaryMock);
		});

		it("should update the boundary size when mode is not 'menu'", () => {
			service.updateBoundarySize("other" as ModalMode);
			expect(boundaryMock.style.width).toBe("800px");
			expect(boundaryMock.style.minHeight).toBe("600px");
		});

		it("should not update the boundary size when mode is 'menu'", () => {
			service.updateBoundarySize("menu");
			expect(boundaryMock.style.width).toBe("");
			expect(boundaryMock.style.minHeight).toBe("");
		});

		it("should not throw if boundary element is not found", () => {
			querySelectorSpy.and.returnValue(null);
			expect(() =>
				service.updateBoundarySize("other" as ModalMode),
			).not.toThrow();
		});
	});
});
