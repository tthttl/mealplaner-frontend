import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { InputComponent } from './input.component';

export default {
  title: 'Input',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule],
    })
  ]
};

export const inputData = {
  isDisabled: false,
  testName: 'test',
  label: 'Label',
  errors: ['Ooops!', 'An error has occured!'],
  placeholder: 'Placeholder',
  formControl: createFormControl()
};

export const Default = () => ({
  component: InputComponent,
  props: {
    ...inputData,
    placeholder: '',
    errors: []
  }
});

export const WithoutLabel = () => ({
  component: InputComponent,
  props: {
    ...inputData,
    label: '',
    errors: []
  }
});

export const WithError = () => ({
  component: InputComponent,
  props: {
    ...inputData,
    placeholder: ''
  }
});


function createFormControl(): FormControl {
  const formGroup: FormGroup = new FormGroup({
    testControl: new FormControl('')
  });
  return formGroup.get('testControl') as FormControl;
}
