import {
	AfterViewChecked,
	Component,
	DoCheck,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	ViewChild,
} from "@angular/core";
import { DrawService } from "../../../draw.service";
import { POINT_SHAPES } from "../../../consts/draw-consts.consts";
import { MapService } from "src/app/modules/map/map.service";
import { Map } from "ol";
import { Fill, Stroke, Style, Text } from "ol/style";
import { Point } from "ol/geom";
import { Coordinate } from "ol/coordinate";
import { DrawCoordinateInputComponent } from "../../draw-options/draw-options-components/draw-coordinate-input/draw-coordinate-input.component";
import { SidenavTools } from "src/app/modules/sidenav/enums/sidenav.enums";
import { CoordinateSystemService } from "src/app/modules/shared/shared-components/coordinate-system-selector/coordintate-system.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-draw-point",
	templateUrl: "./draw-point.component.html",
	styleUrls: ["./draw-point.component.scss"],
})
export class DrawPointComponent implements OnInit {
	private map: Map;
	public pointSize: number | undefined;
	public pointColor: string;
	public addCoordinates = true;
	public showCoordinates: boolean;
	public showCoordinatesFlag: boolean;
	public coordinate: Array<Coordinate>;
	public coordinatesSubscription: Subscription;

	@Input() public tool: string;
	@Output() public pointSizeChange: EventEmitter<number> =
		new EventEmitter<number>();

	public pointShapes = POINT_SHAPES;
	public constructor(
		private drawService: DrawService,
		private mapService: MapService,
	) {}

	public ngOnInit() {
		this.map = this.mapService.getMap();
		this.pointSize = this.drawService.getSize(this.tool);
		this.showCoordinatesFlag = false;
		this.coordinatesSubscription =
			this.drawService.coordinatesChanged.subscribe(() => {
				this.updateCoordinates();
			});
	}

	public ngDoCheck() {
		this.showCoordinatesFlag = this.mapService.checkFeature(
			this.map,
			"sidenavTool",
			SidenavTools.Draw,
		);
	}

	private updateCoordinates() {
		if (this.showCoordinates) {
			this.mapService
				.getAllFeatures(this.map, "sidenavTool", SidenavTools.Draw)
				.forEach((feature) => {
					console.log(feature);
					this.drawService.addText(feature, "drawPoint");
				});
		} else {
			this.mapService
				.getAllFeatures(this.map, "sidenavTool", SidenavTools.Draw)
				.forEach(async (feature) => {
					feature.set("sidenavTool", SidenavTools.Draw);
					feature.setStyle(await this.drawService.getStyle(this.tool));
				});
		}
	}

	public setPointShape(shape: string) {
		this.drawService.setPointShape(shape);
	}

	public updatePointSize() {
		this.pointSizeChange.emit(this.pointSize);
	}

	public showCoordinatesChange() {
		this.showCoordinates = !this.showCoordinates;
		this.showCoordinatesFlag = true;
		this.drawService.setShowCoordinates(this.showCoordinates);
	}
}
