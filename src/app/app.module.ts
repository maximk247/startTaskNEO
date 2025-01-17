import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatSidenavModule } from "@angular/material/sidenav";
import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";
import { HttpClientModule } from "@angular/common/http";
import { InlineSVGModule } from "ng-inline-svg-2";
import { FormsModule } from "@angular/forms";
import { SpatialReferenceService } from "./modules/shared/spatial-reference.service";
import { MapModule } from "./modules/map/map.module";
import { ModalModule } from "./modules/modal/modal.module";
import { SidenavModule } from "./modules/sidenav/sidenav.module";
import { SharedModule } from "./modules/shared/shared.module";

@NgModule({
	declarations: [AppComponent],
	exports: [],
	imports: [
		BrowserModule,
		MapModule,
		SidenavModule,
		ModalModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatSidenavModule,
		KeycloakAngularModule,
		FormsModule,
		SharedModule,
		HttpClientModule,
		InlineSVGModule.forRoot({
			baseUrl: "/assets/images/",
		}),
	],
	providers: [
		SpatialReferenceService,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
