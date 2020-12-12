import { APP_INITIALIZER } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { moduleMetadata } from '@storybook/angular';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { RouterLinkDirectiveStub } from '../../../../../testing/router-link-directive.stub';
import { BetaTeaserComponent } from './beta-teaser.component';

export default {
  title: 'BetaTeaser',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [TranslatePipe, RouterLinkDirectiveStub],
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

export const betaTeaserData = {
  currentLang: 'de',
  translations: {
    de: {
      'beta.teaser': 'Beta Teaser',
    }
  }
};


// tslint:disable-next-line:no-any
const Template: any = (args: BetaTeaserComponent) => ({
  component: BetaTeaserComponent,
  props: args,
});

export let Primary = Template.bind({});
Primary.args = {
  ...betaTeaserData,
};
