import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Locale {
  lang: string;
  data: any;
}

const LOCALIZATION_LOCAL_STORAGE_KEY = 'language';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private langIds: any = [];

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en']);
    this.translate.setDefaultLang('en');

    // ✅ Áp dụng ngôn ngữ đã lưu ngay khi service khởi tạo
    const savedLang = this.getSelectedLanguage();
    this.translate.use(savedLang);
  }

  loadTranslations(...args: Locale[]): void {
    const locales = [...args];

    locales.forEach((locale) => {
      this.translate.setTranslation(locale.lang, locale.data, true);
      this.langIds.push(locale.lang);
    });

    this.translate.addLangs(this.langIds);

    // ✅ Sau khi load xong translations, áp dụng lại ngôn ngữ đã lưu
    const savedLang = this.getSelectedLanguage();
    this.translate.use(savedLang);
  }

  setLanguage(lang: string): void {
    if (lang) {
      // ✅ Bỏ dòng translate.use(getDefaultLang()) thừa ở đây
      this.translate.use(lang);
      localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY, lang);
    }
  }

  getSelectedLanguage(): string {
    return (
      localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY) ||
      this.translate.getDefaultLang()
    );
  }
}