import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	Router,
	RouterStateSnapshot,
} from "@angular/router";
import { KeycloakAuthGuard, KeycloakService } from "keycloak-angular";

@Injectable({
	providedIn: "root",
})
export class AuthGuard extends KeycloakAuthGuard {
	public constructor(
		protected override router: Router,
		protected readonly keycloak: KeycloakService,
	) {
		super(router, keycloak);
	}

	public async isAccessAllowed(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
	) {
		if (!this.authenticated) {
			await this.keycloak.login({
				redirectUri: window.location.origin + state.url,
			});
		}

		return this.authenticated;
	}
}
