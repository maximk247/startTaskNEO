import { Draw } from "ol/interaction";

export class CustomDraw extends Draw {
	public flag = false;
	public override handleMoveEvent(): void {
		if (!this.flag) {
			this.getOverlay().getSource().clear();
		}
	}
}
