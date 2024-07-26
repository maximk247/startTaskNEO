import { NgModule, isDevMode } from "@angular/core";
import { TranslocoModule, provideTransloco } from "@ngneat/transloco";
import { TranslocoHttpLoader } from "./transloco.service";

@NgModule({
	exports: [TranslocoModule],
	providers: [
		provideTransloco({
			config: {
				availableLangs: ["en", "ru"],
				defaultLang: "ru",
				reRenderOnLangChange: true,
				prodMode: !isDevMode(),
			},
			loader: TranslocoHttpLoader,
		}),
	],
})
export class TranslocoRootModule {}
