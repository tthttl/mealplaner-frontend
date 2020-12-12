import { APP_INITIALIZER } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { NavigationComponent } from './navigation.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterLinkDirectiveStub } from '../../../../../testing/router-link-directive.stub';
import { SelectComponent } from '../../../shared/components/select/select.component';

export default {
  title: 'Core/Navigation',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [TranslatePipe, ButtonComponent, SelectComponent, RouterLinkDirectiveStub],
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
  ],
};

export const navigationData = {
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
      'app.navigation.account': 'Konto',
    }
  }
};

export const actionsData = {
  logout: action('clicked'),
  languageChanged: action('languageChanged')
};

// tslint:disable-next-line:no-any
const Template: any = (args: NavigationComponent) => ({
  component: NavigationComponent,
  props: args,
});

export let Primary = Template.bind({});
Primary.args = {
  ...navigationData,
  ...actionsData,
};

export let LoggedOut = Template.bind({});
LoggedOut.args = {
  ...navigationData,
  ...actionsData,
};

export let LoggedIn = Template.bind({});
LoggedIn.args = {
  ...navigationData,
  isLoggedIn: true,
  ...actionsData,
};

