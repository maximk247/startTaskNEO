import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { LineString, Polygon } from "ol/geom";
import { SpatialReference } from "src/app/modules/shared/interfaces/spatial-reference.interfaces";
import * as proj4x from "proj4";
import { TranslocoService } from "@ngneat/transloco";
import { MapService } from "src/app/modules/map/map.service";
import { DrawService } from "../../../../draw.service";
import { DrawTools, ProjectionType } from "../../enum/draw-options.enum";
import { SidenavTools } from "src/app/modules/sidenav/enums/sidenav.enums";
import { Tools } from "../../../../enum/draw.enum";
import { NotificationComponent } from "src/app/modules/shared/shared-components/notification/notification.component";

@Component({
	selector: "app-coordinate-input",
	templateUrl: "./draw-coordinate-input.component.html",
	styleUrls: ["./draw-coordinate-input.component.scss"],
})
export class DrawCoordinateInputComponent implements OnInit {
	@Input() public tool: string;
	@Input() public showCoordinates: boolean;

	public spatialReferences: Array<SpatialReference> = [];
	private newProjection: SpatialReference;

	public coordinateForm: FormGroup;

	public drawPoint = DrawTools.Point;
	public drawLine = DrawTools.Line;
	public drawPolygon = DrawTools.Polygon;

	@ViewChild(NotificationComponent) public notification: NotificationComponent;

	public constructor(
		private fb: FormBuilder,
		private mapService: MapService,
		private drawService: DrawService,
		private translocoService: TranslocoService,
	) {}

	public ngOnInit(): void {
		this.coordinateForm = this.fb.group({
			points: this.fb.array([this.createPointFormGroup()]),
		});
	}

	public get points(): FormArray {
		return this.coordinateForm.get("points") as FormArray;
	}

	private createPointFormGroup(): FormGroup {
		return this.fb.group({
			x: ["", [Validators.required, Validators.pattern(/^[0-9]+(?!.)/)]],
			y: ["", [Validators.required, Validators.pattern(/^[0-9]+(?!.)/)]],
		});
	}

	public addPoint(): void {
		this.points.push(this.createPointFormGroup());
	}

	public removePoint(index: number): void {
		if (this.points.length > 1) {
			this.points.removeAt(index);
		}
	}

	public onSelectedReferenceChange(selectedReference: SpatialReference): void {
		this.newProjection = selectedReference;
	}

	private transformCoordinates(point: any) {
		const proj4 = (proj4x as any).default;
		let [x, y] = [+point.x, +point.y];

		if (this.newProjection.type === ProjectionType.Metric) {
			[x, y] = proj4(this.newProjection.name, "EPSG:4326", [
				+point.x,
				+point.y,
			]);
		} else if (this.newProjection.type === ProjectionType.Degree) {
			[x, y] = proj4(this.newProjection.name).forward([+point.x, +point.y]);
		}

		return [x, y];
	}

	private async createFeature(
		coordinates: Array<any>,
		geometryType: DrawTools,
	) {
		const style = await this.drawService.getStyle(this.tool);
		let feature;

		switch (geometryType) {
			case DrawTools.Point:
				feature = new Feature({
					geometry: new Point(coordinates[0]),
				});
				break;
			case DrawTools.Line:
				feature = new Feature({
					geometry: new LineString(coordinates),
				});
				break;
			case DrawTools.Polygon:
				feature = new Feature({
					geometry: new Polygon([coordinates]),
				});
				break;
		}
		feature.set("sidenavTool", SidenavTools.Draw);
		feature.setStyle(style);
		if (this.showCoordinates && this.tool === Tools.Point) {
			this.drawService.addText(feature, Tools.Point);
		}
		this.mapService.addFeatureToMap(feature);
	}

	public async addPointToMap(): Promise<void> {
		for (const point of this.points.controls) {
			const coordinates = [this.transformCoordinates(point.value)];
			await this.createFeature(coordinates, DrawTools.Point);
		}
	}

	public async addLineToMap(): Promise<void> {
		if (this.points.length >= 2) {
			const coordinates = this.points.controls.map((point) =>
				this.transformCoordinates(point.value),
			);
			coordinates.push(coordinates[0]);
			await this.createFeature(coordinates, DrawTools.Line);
		} else {
			const errorMessage = this.translocoService.translate(
				"errorDueToNotEnoughPoints",
			);
			this.notification.show(errorMessage);
		}
	}

	public async addPolygonToMap(): Promise<void> {
		if (this.points.length >= 4) {
			const coordinates = this.points.controls.map((point) =>
				this.transformCoordinates(point.value),
			);
			coordinates.push(coordinates[0]);
			await this.createFeature(coordinates, DrawTools.Polygon);
		} else {
			const errorMessage = this.translocoService.translate(
				"errorDueToNotEnoughPoints",
			);
			this.notification.show(errorMessage);
		}
	}

	public removeAllCoordinates() {
		this.points.clear();
		this.addPoint();
	}

	public onChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		const selectedRef = this.spatialReferences.find(
			(ref) => ref.id === +target.value,
		);
		if (selectedRef) {
			this.newProjection = selectedRef;
		}
	}
}
