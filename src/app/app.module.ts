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
import { ScaleBarComponent } from "./components/map/map-widgets/scale-bar/scale-bar.component";
import { SliderComponent } from "./components/map/map-widgets/slider/slider.component";
import { ControlsComponent } from "./components/map/map-widgets/controls/controls.component";
import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";
import { DrawPointComponent } from "./components/sidenav/draw/draw-tools/draw-point/draw-point.component";
import { HttpClientModule } from "@angular/common/http";
import { InlineSVGModule } from "ng-inline-svg-2";
import { FormsModule } from "@angular/forms";
import { DrawSizeComponent } from "./components/sidenav/draw/draw-options/draw-size/draw-size.component";
import { ColorPickerModule } from "ngx-color-picker";
import { DrawColorComponent } from "./components/sidenav/draw/draw-options/draw-color/draw-color.component";
import { DialogComponent } from "./components/dialog/dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { TransparencyComponent } from "./components/sidenav/draw/draw-options/draw-transparency/draw-transparency.component";
import { CoordinateInputComponent } from "./components/coordinate-input/coordinate-input.component";
import { SpatialReferenceService } from "./components/spatial-reference.service";
import { DrawLineComponent } from "./components/sidenav/draw/draw-tools/draw-line/draw-line.component";
import { DrawPolygonComponent } from "./components/sidenav/draw/draw-tools/draw-polygon/draw-polygon.component";
import { DrawFreeLineComponent } from "./components/sidenav/draw/draw-tools/draw-free-line/draw-free-line.component";
import { DrawFreePolygonComponent } from "./components/sidenav/draw/draw-tools/draw-free-polygon/draw-free-polygon.component";
import { DrawFigureComponent } from "./components/sidenav/draw/draw-tools/draw-figure/draw-figure.component";
import { DrawShapeComponent } from "./components/sidenav/draw/draw-options/draw-shape/draw-shape.component";
import { DrawDeleteComponent } from './components/sidenav/draw/draw-editing/draw-delete/draw-delete.component';

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
		DrawPointComponent,
		DrawSizeComponent,
		DrawColorComponent,
		DialogComponent,
		TransparencyComponent,
		CoordinateInputComponent,
		DrawLineComponent,
		DrawPolygonComponent,
		DrawFreeLineComponent,
		DrawFreePolygonComponent,
		DrawFigureComponent,
		DrawShapeComponent,
  DrawDeleteComponent,
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
		ColorPickerModule,
		MatDialogModule,
		FormsModule,

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
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
