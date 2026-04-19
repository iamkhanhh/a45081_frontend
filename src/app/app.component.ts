import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslationService } from './modules/i18n';
import { TranslateService } from '@ngx-translate/core';

// language list
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as chLang } from './modules/i18n/vocabs/ch';
import { locale as esLang } from './modules/i18n/vocabs/es';
import { locale as jpLang } from './modules/i18n/vocabs/jp';
import { locale as deLang } from './modules/i18n/vocabs/de';
import { locale as frLang } from './modules/i18n/vocabs/fr';

import { ThemeModeService } from './_metronic/partials/layout/theme-mode-switcher/theme-mode.service';

@Component({
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(
    private translationService: TranslationService,
    private modeService: ThemeModeService,
    // ✅ Không cần inject TranslateService trực tiếp ở đây nữa
  ) {
    // load translations — TranslationService.loadTranslations()
    // sẽ tự gọi translate.use(savedLang) bên trong
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang
    );

    // ❌ Xóa 2 dòng này đi
    // this.translate.setDefaultLang('en');
    // this.translate.use('en');
  }

  ngOnInit() {
    this.modeService.init();
  }

  switchLang(lang: string) {
    // ✅ Dùng TranslationService thay vì gọi translate trực tiếp
    this.translationService.setLanguage(lang);
  }
}