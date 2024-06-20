import { Injectable } from "@angular/core";
import * as proj4x from "proj4";
import { ProjectionType } from "src/app/modules/sidenav/components/draw/draw-modules/draw-options/enum/draw-options.enum";
@Injectable({
	providedIn: "root",
})
export class CoordinateSystemService {
	private projection: any;

	public setProjection(projection: any) {
		this.projection = projection;
	}

	public getProjection() {
		return this.projection;
	}

	public transformCoordinates(coordinate: any) {
		const proj4 = (proj4x as any).default;
		let [x, y] = [+coordinate[0], +coordinate[1]];

		if (this.projection.type === ProjectionType.Metric) {
			[x, y] = proj4(this.projection.name).forward([
				+coordinate[0],
				+coordinate[1],
			]);
		} else if (this.projection.type === ProjectionType.Degree) {
			[x, y] = proj4(this.projection.name).forward([
				+coordinate[0],
				+coordinate[1],
			]);
		}

		return [x, y];
	}
}
