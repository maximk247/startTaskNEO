import { TestBed, ComponentFixture } from "@angular/core/testing";
import { MenuComponent } from "./menu.component";
import { KeycloakService } from "keycloak-angular";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { getTranslocoModule } from "src/app/modules/shared/transloco/transloco-testing.module";

describe("MenuComponent", () => {
	let component: MenuComponent;
	let fixture: ComponentFixture<MenuComponent>;
	let keycloakServiceSpy: jasmine.SpyObj<KeycloakService>;

	beforeEach(async () => {
		const spy = jasmine.createSpyObj("KeycloakService", ["logout"]);

		await TestBed.configureTestingModule({
			declarations: [MenuComponent],
			providers: [{ provide: KeycloakService, useValue: spy }],
			imports: [getTranslocoModule()],
		}).compileComponents();

		keycloakServiceSpy = TestBed.inject(
			KeycloakService,
		) as jasmine.SpyObj<KeycloakService>;
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should call KeycloakService logout method on onLogout", () => {
		component.onLogout();
		expect(keycloakServiceSpy.logout).toHaveBeenCalled();
	});

	it("should have a logout button that triggers onLogout", () => {
		const debugElement: DebugElement = fixture.debugElement;
		const button = debugElement.query(By.css(".menu-container__logout"));
		expect(button).toBeTruthy();
		button.triggerEventHandler("click", null);
		expect(keycloakServiceSpy.logout).toHaveBeenCalled();
	});
});
