import { Component, Input } from "@angular/core";

@Component({
	selector: "app-explanation",
	templateUrl: "./explanation.component.html",
	styleUrls: ["./explanation.component.scss"],
})
export class ExplanationComponent {
	@Input() public text: string;
}
