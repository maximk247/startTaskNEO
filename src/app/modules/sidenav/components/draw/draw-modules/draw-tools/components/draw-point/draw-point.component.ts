import {
	Component,
	DoCheck,
	EventEmitter,
	Input,
	OnInit,
	Output,
} from "@angular/core";
import { DrawService } from "../../../../draw.service";
import { POINT_SHAPES } from "../../../../consts/draw-consts.consts";
import { MapService } from "src/app/modules/map/map.service";
import { Map } from "ol";
import { Coordinate } from "ol/coordinate";
import { SidenavTools } from "src/app/modules/sidenav/enums/sidenav.enums";
import { Subscription } from "rxjs";
import { Tools } from "../../../../enum/draw.enum";
import { Point } from "ol/geom";

@Component({
	selector: "app-draw-point",
	templateUrl: "./draw-point.component.html",
	styleUrls: ["./draw-point.component.scss"],
})
export class DrawPointComponent implements OnInit, DoCheck {
	private map: Map;
	public pointSize: number | undefined;
	public pointColor: string;
	public addCoordinates: boolean;
	public showCoordinates: boolean;
	public showCoordinatesFlag: boolean | undefined;
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
		this.showCoordinatesFlag = this.drawService.getShowCoordinates();
		this.showCoordinates = this.showCoordinatesFlag;
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
			"Point",
		);
	}

	private updateCoordinates() {
		if (this.showCoordinates) {
			this.mapService
				.getAllFeatures(this.map, "sidenavTool", SidenavTools.Draw)
				.forEach((feature) => {
					this.drawService.addText(feature, Tools.Point);
				});
		} else {
			this.mapService
				.getAllFeatures(this.map, "sidenavTool", SidenavTools.Draw)
				.forEach((feature) => {
					if (feature.getGeometry() instanceof Point) {
						this.drawService.removeText(feature);
					}
				});
		}
	}

	public setPointShape(shape: string) {
		this.drawService.setPointShape(shape);
	}

	public getActive(shape: string) {
		return this.drawService.getPointShape() === shape ? 'active': ''
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
