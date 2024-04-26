import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { CdkDrag, DragDropModule } from "@angular/cdk/drag-drop";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatMenuModule } from "@angular/material/menu";
import { MatSliderModule } from "@angular/material/slider";
import { ModalComponent } from "./components/modal/modal.component";
import { MeasurementComponent } from "./components/sidenav/measurement/measurement.component";
import { CoordinatesComponent } from "./components/sidenav/coordinates/coordinates.component";
import { DrawComponent } from "./components/sidenav/draw/draw.component";
import { MenuComponent } from "./components/sidenav/menu/menu.component";
import { MapComponent } from "./components/map/map.component";
import { ScaleBarComponent } from "./components/map-widgets/scale-bar/scale-bar.component";
import { SliderComponent } from "./components/map-widgets/slider/slider.component";
import { ControlsComponent } from "./components/map-widgets/controls/controls.component";
import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";

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
	declarations: [
		AppComponent,
		MeasurementComponent,
		CoordinatesComponent,
		DrawComponent,
		MenuComponent,
		MapComponent,
		ScaleBarComponent,
		SliderComponent,
		ControlsComponent,
		ModalComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		DragDropModule,
		MatSidenavModule,
		MatSliderModule,
		MatMenuModule,
		CdkDrag,
		KeycloakAngularModule,
	],
	providers: [
		{
			provide: APP_INITIALIZER,
			useFactory: initializeKeycloak,
			multi: true,
			deps: [KeycloakService],
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
