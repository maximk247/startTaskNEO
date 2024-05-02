import { Component } from "@angular/core";
import { KeycloakService } from "keycloak-angular";

@Component({
	selector: "app-menu",
	templateUrl: "./menu.component.html",
	styleUrls: ["./menu.component.scss"],
})
export class MenuComponent {
	constructor(public atest: KeycloakService) {}
	public onLogout(): void {
		this.atest.logout();
	}
}
