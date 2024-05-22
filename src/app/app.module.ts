import { APP_INITIALIZER, NgModule, isDevMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatSidenavModule } from "@angular/material/sidenav";
import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";
import { HttpClientModule } from "@angular/common/http";
import { InlineSVGModule } from "ng-inline-svg-2";
import { FormsModule } from "@angular/forms";
import { SpatialReferenceService } from "./components/spatial-reference.service";
import { TranslocoModule, provideTransloco } from "@ngneat/transloco";
import { TranslocoHttpLoader } from "./transloco.service";
import { MapModule } from "./components/map/map.module";
import { ModalModule } from "./components/modal/modal.module";
import { DialogModule } from "./components/dialog/dialog.module";
import { SidenavModule } from "./components/sidenav/sidenav.module";


function initializeKeycloak(keycloak: KeycloakService) {
	return () =>
		keycloak.init({
			config: {
				url: "https://gs-keycloak.neostk.com",
				realm: "geo-solution",
				clientId: "neoportal",
			},
			initOptions: {
				onLoad: "check-sso",
				silentCheckSsoRedirectUri:
					window.location.origin + "/assets/silent-check-sso.html",
			},
		});
}
@NgModule({
	declarations: [AppComponent],
	exports: [],
	imports: [
		BrowserModule,
		MapModule,
		SidenavModule,
		ModalModule,
		DialogModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatSidenavModule,
		KeycloakAngularModule,
		FormsModule,
		TranslocoModule,
		HttpClientModule,
		InlineSVGModule.forRoot({
			baseUrl: "../../../assets/images/",
		}),
	],
	providers: [
		// {
		// 	provide: APP_INITIALIZER,
		// 	useFactory: initializeKeycloak,
		// 	multi: true,
		// 	deps: [KeycloakService],
		// },
		SpatialReferenceService,
		provideTransloco({
			config: {
				availableLangs: ["en", "ru"],
				defaultLang: "ru",
				reRenderOnLangChange: true,
				prodMode: !isDevMode(),
			},
			loader: TranslocoHttpLoader,
		}),
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
