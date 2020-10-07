import { APP_INITIALIZER } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { NavigationComponent } from './navigation.component';
import { TranslatePipe } from '../../i18n/pipes/translate.pipe';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterLinkDirectiveStub } from '../../../../testing/router-link-directive.stub';


export default {
  title: 'Navigation',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [TranslatePipe, ButtonComponent, RouterLinkDirectiveStub],
      imports: [FontAwesomeModule, BrowserModule],
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: (iconLibrary: FaIconLibrary) => {
            return async () => {
              iconLibrary.addIconPacks(fas);
            };
          },
          deps: [FaIconLibrary],
          multi: true,
        },
      ]
    })
  ]
};

export const actionsData = {
  clicked: action('clicked')
};

export const buttonData = {
  isLoggedIn: false,
  currentLang: 'de',
  translations: {
    de: {
      'app.navigation.login': 'Login',
      'app.navigation.logout': 'Abmelden',
      'app.navigation.register': 'Registrieren',
      'app.navigation.planer': 'Menuplaner',
      'app.navigation.menus': 'Menüs',
      'app.navigation.shopping-list': 'Einkaufsliste',
    }
  }
};

export const Default = () => ({
  component: NavigationComponent,
  props: {
    isLoggedIn: buttonData.isLoggedIn,
    currentLang: buttonData.currentLang,
    translations: buttonData.translations,
  }
});

export const LoggedIn = () => ({
  component: NavigationComponent,
  props: {
    isLoggedIn: true,
    currentLang: buttonData.currentLang,
    translations: buttonData.translations,
  }
});


