import { Component, HostListener, Input, OnInit } from "@angular/core";
import { ModalService } from "./modal.service";
import { ModalMode } from "./interfaces/modal.interface";

@Component({
	selector: "app-modal",
	templateUrl: "./modal.component.html",
	styleUrls: ["./modal.component.scss"],
})
export class ModalComponent implements OnInit {
	@Input() public mode: ModalMode;

	public constructor(private modalService: ModalService) {}

	public ngOnInit(): void {
		this.modalService.updateBoundarySize(this.mode);
	}

	@HostListener("window:resize", ["$event"])
	public onResize(): void {
		this.modalService.updateBoundarySize(this.mode);
	}
}
