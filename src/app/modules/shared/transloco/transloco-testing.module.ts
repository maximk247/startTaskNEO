import {
	TranslocoTestingOptions,
	TranslocoTestingModule,
} from "@ngneat/transloco";
import ru from "src/assets/i18n/ru.json";

export function getTranslocoModule(options: TranslocoTestingOptions = {}) {
	return TranslocoTestingModule.forRoot({
		langs: { ru },
		translocoConfig: {
			availableLangs: ["ru", "en"],
			defaultLang: "ru",
		},
		preloadLangs: true,
	});
}
