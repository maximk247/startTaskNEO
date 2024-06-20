import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MapService } from "../../../map/map.service";
import Map from "ol/Map";
import { Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { SpatialReference } from "../../../shared/interfaces/spatial-reference.interfaces";
import * as proj4x from "proj4";

import { SidenavTools } from "../../enums/sidenav.enums";
import { Coordinate } from "ol/coordinate";
import { Icon, Style } from "ol/style";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DrawService } from "../draw/draw.service";
import { ProjectionType } from "../draw/draw-modules/draw-options/enum/draw-options.enum";

@Component({
	selector: "app-coordinates",
	templateUrl: "./coordinates.component.html",
	styleUrls: ["./coordinates.component.scss"],
})
export class CoordinatesComponent implements OnInit {
	private map: Map;
	private pointLayer: VectorLayer<VectorSource>;
	public spatialReferences: Array<SpatialReference> = [];
	public newProjection: SpatialReference;
	public coordinatesForm: FormGroup;

	public constructor(
		private mapService: MapService,
		private drawService: DrawService,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
	) {}

	public ngOnInit() {
		this.map = this.mapService.getMap();
		this.pointLayer = new VectorLayer({
			source: new VectorSource(),
		});
		this.map.addLayer(this.pointLayer);
		const interactions = this.map.getInteractions().getArray();
		interactions.forEach((interaction) => {
			if (interaction.get("sidenavTool")) {
				this.drawService.removeGlobalInteraction(this.map, interaction);
			}
		});
		this.mapService.addCursorToMap();
		this.coordinatesForm = this.fb.group({
			x: [""],
			y: [""],
			latitudeDegrees: [""],
			latitudeMinutes: [""],
			latitudeSeconds: [""],
			longitudeDegrees: [""],
			longitudeMinutes: [""],
			longitudeSeconds: [""],
			showPoint: [false],
		});
	}

	public onSelectedReferenceChange(selectedReference: SpatialReference): void {
		this.newProjection = selectedReference;
		this.resetFormFields();
		this.setValidators();
		this.cdr.detectChanges();
	}

	private clearValidators(fields: Array<string>) {
		fields.forEach((field) => {
			this.coordinatesForm.controls[field].clearValidators();
			this.coordinatesForm.controls[field].updateValueAndValidity();
		});
	}

	private setValidators() {
		if (this.newProjection.type === ProjectionType.Metric) {
			this.coordinatesForm.controls["x"].setValidators(Validators.required);
			this.coordinatesForm.controls["y"].setValidators(Validators.required);
			this.clearValidators(["latitudeDegrees", "longitudeDegrees"]);
		} else if (this.newProjection.type === ProjectionType.Degree) {
			this.coordinatesForm.controls["latitudeDegrees"].setValidators(
				Validators.required,
			);
			this.coordinatesForm.controls["longitudeDegrees"].setValidators(
				Validators.required,
			);
			this.clearValidators(["x", "y"]);
		}
		this.coordinatesForm.updateValueAndValidity();
		this.cdr.detectChanges();
	}

	public goToCoordinates() {
		const proj4 = (proj4x as any).default;
		let transformCoordinates;
		if (this.newProjection.type === ProjectionType.Degree) {
			const latitude =
				Number(this.coordinatesForm.value.latitudeDegrees) +
				Number(this.coordinatesForm.value.latitudeMinutes) / 60 +
				Number(this.coordinatesForm.value.latitudeSeconds) / 3600;
			const longitude =
				Number(this.coordinatesForm.value.longitudeDegrees) +
				Number(this.coordinatesForm.value.longitudeMinutes) / 60 +
				Number(this.coordinatesForm.value.longitudeSeconds) / 3600;

			const coordinates = [longitude, latitude];
			transformCoordinates = proj4(this.newProjection.name).forward(
				coordinates,
			);
		} else if (this.newProjection.type === ProjectionType.Metric) {
			const x = Number(this.coordinatesForm.value.x);
			const y = Number(this.coordinatesForm.value.y);

			transformCoordinates = proj4(this.newProjection.name, "EPSG:4326", [
				x,
				y,
			]);
		}
		if (this.coordinatesForm.value.showPoint) {
			this.addPointToMap(transformCoordinates);
		}
		this.map.getView().setCenter(transformCoordinates);
	}

	public addPointToMap(coordinates: Coordinate) {
		const point = new Point(coordinates);
		const feature = new Feature(point);
		feature.set("sidenavTool", SidenavTools.Coordinates);
		const iconStyle = new Icon({
			src: "assets/images/marker-big.png",
		});
		const pointStyle = new Style({
			image: iconStyle,
		});
		feature.setStyle(pointStyle);
		this.pointLayer.getSource()?.addFeature(feature);
	}

	public onChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const selectedRef = this.spatialReferences.find(
			(ref) => ref.name === target.value,
		);
		if (selectedRef) {
			this.newProjection = selectedRef;
		}
	}

	private resetFormFields() {
		Object.keys(this.coordinatesForm.controls).forEach((key) => {
			this.coordinatesForm.controls[key].reset();
		});
	}

	public removeAllCoordinates() {
		this.mapService.removeAllFeatures(SidenavTools.Coordinates);
		this.resetFormFields();
	}
	public get isAnyFieldFilled(): boolean | undefined {
		if (this.newProjection) {
			if (this.newProjection.type === ProjectionType.Metric) {
				return !!this.coordinatesForm.value.x || !!this.coordinatesForm.value.y;
			} else if (this.newProjection.type === ProjectionType.Degree) {
				return (
					!!this.coordinatesForm.value.latitudeDegrees ||
					!!this.coordinatesForm.value.latitudeMinutes ||
					!!this.coordinatesForm.value.latitudeSeconds ||
					!!this.coordinatesForm.value.longitudeDegrees ||
					!!this.coordinatesForm.value.longitudeMinutes ||
					!!this.coordinatesForm.value.longitudeSeconds
				);
			}
			return false;
		}
	}
}
