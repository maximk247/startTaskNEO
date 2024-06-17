import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SpatialReference } from "src/app/modules/shared/interfaces/spatial-reference.interfaces";
import { SpatialReferenceService } from "src/app/modules/shared/spatial-reference.service";
import { TranslocoService } from "@ngneat/transloco";
import { register } from "ol/proj/proj4";
import * as proj4x from "proj4";

@Component({
	selector: "app-coordinate-system",
	templateUrl: "./coordinate-system.component.html",
	styleUrls: ["./coordinate-system.component.scss"],
})
export class CoordinateSystemComponent implements OnInit {
	@Input() public spatialReferences: Array<SpatialReference> = [];
	@Output() public selectedReferenceChange =
		new EventEmitter<SpatialReference>();

	public currentProjection: SpatialReference;

	public constructor(
		private spatialReferenceService: SpatialReferenceService,
		private translocoService: TranslocoService,
	) {}

	public ngOnInit(): void {
		this.getSpatialReferences();
	}

	private getSpatialReferences(): void {
		this.spatialReferenceService.getSpatialReferences().subscribe(
			(data: Array<SpatialReference>) => {
				this.spatialReferences = data;
				this.setDefaultProjection();
				this.registerProjections();
			},
			(error) => {
				const errorMessage = this.translocoService.translate(
					"errorDueToSpecialReference",
				);
				console.error(errorMessage, error);
			},
		);
	}

	private registerProjections(): void {
		const proj4 = (proj4x as any).default;
		this.spatialReferences.forEach((ref) => {
			proj4.defs(ref.name, ref.definition);
		});
		register(proj4);
	}

	private setDefaultProjection(): void {
		if (this.spatialReferences.length > 0) {
			this.currentProjection = this.spatialReferences[0];
			this.selectedReferenceChange.emit(this.currentProjection);
		}
	}

	public onChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		const selectedRef = this.spatialReferences.find(
			(ref) => ref.id === +target.value,
		);
		if (selectedRef) {
			this.currentProjection = selectedRef;
			this.selectedReferenceChange.emit(this.currentProjection);
		}
	}
}
