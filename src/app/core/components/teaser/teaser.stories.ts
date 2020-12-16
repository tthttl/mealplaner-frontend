import { APP_INITIALIZER } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { moduleMetadata } from '@storybook/angular';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { RouterLinkDirectiveStub } from '../../../../../testing/router-link-directive.stub';
import { TeaserComponent } from './teaser.component';

export default {
  title: 'Core/Teaser',
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
  text: 'Teaser Text',
};


// tslint:disable-next-line:no-any
const Template: any = (args: TeaserComponent) => ({
  component: TeaserComponent,
  props: args,
});

export let Primary = Template.bind({});
Primary.args = {
  ...betaTeaserData
};
