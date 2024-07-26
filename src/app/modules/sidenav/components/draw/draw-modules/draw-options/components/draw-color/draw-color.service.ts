import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class ColorService {
	private colorSubject = new BehaviorSubject<string>("rgba(0, 0, 0, 1)");
	public color$ = this.colorSubject.asObservable();

	public setColor(color: string) {
		this.colorSubject.next(color);
	}
}
