import {
	AfterContentChecked,
	Component,
	HostListener,
	Input,
} from "@angular/core";
import { ModalService } from "./modal.service";
import { ModalMode } from "./interfaces/modal.interface";

@Component({
	selector: "app-modal",
	templateUrl: "./modal.component.html",
	styleUrls: ["./modal.component.scss"],
})
export class ModalComponent implements AfterContentChecked {
	@Input() public mode: ModalMode;
	public turn = false;
	public isVisible = true;
	public constructor(private modalService: ModalService) {}

	public ngAfterContentChecked(): void {
		this.modalService.updateBoundarySize(this.mode);
	}

	@HostListener("window:resize", ["$event"])
	public onResize(): void {
		this.modalService.updateBoundarySize(this.mode);
	}
	public toggleTurn(): void {
		this.turn = !this.turn;
	}
	public closeModal(): void {
		this.isVisible = false;
	}
}
