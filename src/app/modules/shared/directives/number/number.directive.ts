import { Directive, OnDestroy, OnInit } from "@angular/core";
import { NgControl } from "@angular/forms";
import { Subscription } from "rxjs";

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: "[numbers]",
})
export class NumbersDirective implements OnInit, OnDestroy {
	public sub: Subscription | undefined = new Subscription();

	public constructor(private ngControl: NgControl) {}

	public ngOnInit() {
		this.sub = this.ngControl.valueChanges?.subscribe((value) => {
			this.ngControl.control?.setValue((value || "").replace(/[^0-9]*/g, ""), {
				emitEvent: false,
			});
		});
	}
	public ngOnDestroy() {
		this.sub?.unsubscribe();
	}
}
