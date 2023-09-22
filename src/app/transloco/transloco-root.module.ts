import { HttpClient } from '@angular/common/http';
import {
  Translation,
  TranslocoLoader,
  provideTransloco,
  TranslocoModule
} from '@ngneat/transloco';
import { TranslocoLocaleModule, provideTranslocoLocale } from '@ngneat/transloco-locale';
import { Injectable, isDevMode, NgModule } from '@angular/core';
import { getBrowserLang } from '@ngneat/transloco';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

@NgModule({
  exports: [TranslocoModule, TranslocoLocaleModule],
  providers: [
    provideTransloco({
      config: {
        availableLangs: ['da', 'de', 'en', 'es', 'fr', 'ko'],
        defaultLang: getBrowserLang() || 'en',
        fallbackLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader
    }),
    provideTranslocoLocale({
      langToLocaleMapping: {
        da: 'da-DK',
        de: 'de-DE',
        en: 'en-GB',
        es: 'es-ES',
        fr: 'fr-FR',
        ko: 'ko-KR'
      }
    })
  ],
})
export class TranslocoRootModule { }
