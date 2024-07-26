import { Draw } from "ol/interaction";
import { Options } from "ol/interaction/Draw";

export class CustomDraw extends Draw {
	public flag = false;
	public override handleMoveEvent(): void {
		if (!this.flag) {
			this.getOverlay().getSource().clear();
		}
	}
	public constructor(options: Options) {
		super(options);
	}
}
