import { NotFoundComponent } from './not-found.component';

export default {
  title: 'Core/NotFound',
  excludeStories: /.*Data$/,
};


// tslint:disable-next-line:no-any
const Template: any = (args: NotFoundComponent) => ({
  component: NotFoundComponent,
  props: args,
});

export let Primary = Template.bind({});
Primary.args = {};
