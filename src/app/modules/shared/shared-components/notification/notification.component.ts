import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";

@Component({
	selector: "app-notification",
	templateUrl: "./notification.component.html",
	styleUrls: ["./notification.component.scss"],
})
export class NotificationComponent {
	@Input() public message: string;
	public isVisible = false;

	public show(message: string) {
        this.message = message;
        this.isVisible = true;
        setTimeout(() => this.close(), 3000);
      }

	public close() {
		this.isVisible = false;
		setTimeout(() => (this.message = ""), 300);
	}
}
