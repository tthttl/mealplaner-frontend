import { APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AuthFormComponent } from './auth-form.component';

export default {
  title: 'LoginForm',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      imports: [FontAwesomeModule, ReactiveFormsModule],
      declarations: [ButtonComponent, InputComponent, TranslatePipe],
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
        {
          provide: TranslatePipe,
          useClass: TranslatePipe
        }
      ]
    })
  ]
};

export const actionsData = {
  credentialsReceived: action('credentialsReceived')
};

export const formData = {
  translations: {
    de: {
      email: 'Email Adresse',
      password: 'Passwort',
      login: 'Anmelden',
      register: 'Registrieren',
      'errors.validation.email.required': 'Bitte geben Sie Ihre Email Adresse ein',
      'errors.validation.email.pattern': 'Valid Email Format braucht @ ein . dann mindestens 2 Zeichen',
      'errors.validation.password.required': 'Bitte geben Sie Ihre Passwort ein',
      'errors.validation.password.minlength': 'Passwort muss mindestens 4 character lang sein',
      'errors.validation.password.pattern': 'Passwort braucht klein und gross Buchstaben und ein Zahl'
      }
    }
};

export const Login = () => ({
  component: AuthFormComponent,
  props: {
    credentialsReceived: actionsData.credentialsReceived,
    translations: formData.translations
  }
});

export const Register = () => ({
  component: AuthFormComponent,
  props: {
    credentialsReceived: actionsData.credentialsReceived,
    translations: formData.translations,
    buttonText: 'register'
  }
});
