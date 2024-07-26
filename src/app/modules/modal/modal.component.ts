import {
	AfterContentChecked,
	Component,
	EventEmitter,
	HostListener,
	Input,
	Output,
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
	@Output() public visibleChange: EventEmitter<boolean> =
		new EventEmitter<boolean>();
	public turn = false;
	public isVisible = true;
	public constructor(private modalService: ModalService) {}

	public ngAfterContentChecked(): void {
		this.modalService.updateBoundarySize(this.mode);
	}

	public cancelModal() {
		this.isVisible = false;
		this.visibleChange.emit(false)
	}

	@HostListener("window:resize", ["$event"])
	public onResize(): void {
		this.modalService.updateBoundarySize(this.mode);
	}
}
