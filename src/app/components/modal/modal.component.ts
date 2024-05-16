import { Component, HostListener, Input, OnInit } from "@angular/core";
import { ModalService } from "./modal.service";
import { ModalMode } from "./interfaces/modal.interface";

@Component({
	selector: "app-modal",
	templateUrl: "./modal.component.html",
	styleUrls: ["./modal.component.scss"],
})
export class ModalComponent implements OnInit {
	@Input() mode: ModalMode;

	constructor(private modalService: ModalService) {}

	ngOnInit(): void {
		this.modalService.updateBoundarySize(this.mode);
	}

	@HostListener("window:resize", ["$event"])
	onResize(): void {
		this.modalService.updateBoundarySize(this.mode);
	}
}
