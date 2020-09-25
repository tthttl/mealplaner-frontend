import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { SharedModule } from '../../../shared/shared.module';

import { RecipeFormComponent } from './recipe-form.component';

describe('RecipeFormComponent', () => {
  let component: RecipeFormComponent;
  let fixture: ComponentFixture<RecipeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SharedModule, MatSlideToggleModule],
      declarations: [RecipeFormComponent, TranslatePipe],
      providers: [
        {
          provide: TranslatePipe,
          useClass: TranslatePipe
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submit button should be disabled when inputs are empty', () => {
    const hostElement = fixture.nativeElement;
    const button = hostElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTruthy();

  });

  it('new ingredient button should be disabled when amount is invalid', () => {
    const hostElement = fixture.nativeElement;
    const button = hostElement.querySelector('button.icon-wrapper');
    const amountInput = hostElement.querySelector('input[ng-reflect-name="amount"]');
    const nameInput = hostElement.querySelector('input[ng-reflect-name="name"]');
    amountInput.value = 0;
    amountInput.dispatchEvent(new Event('input'));
    nameInput.value = 'Beer';
    nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(button.disabled).toBeTruthy();

  });

  it('new ingredient button should be disabled when name is empty', () => {
    const hostElement = fixture.nativeElement;
    const button = hostElement.querySelector('button.icon-wrapper');
    const amountInput = hostElement.querySelector('input[ng-reflect-name="amount"]');
    amountInput.value = 1;
    amountInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(button.disabled).toBeTruthy();

  });

  it('should emit Recipe when inputs are filled and submit is clicked', () => {
    spyOn(component.recipeSaved, 'emit');
    const hostElement = fixture.nativeElement;
    const titleInput = hostElement.querySelector('input[ng-reflect-name="title"]');
    const amountInput = hostElement.querySelector('input[ng-reflect-name="amount"]');
    const nameInput = hostElement.querySelector('input[ng-reflect-name="name"]');
    const select = hostElement.querySelector('select');

    titleInput.value = 'Recipe';
    titleInput.dispatchEvent(new Event('input'));
    amountInput.value = 1;
    amountInput.dispatchEvent(new Event('input'));
    nameInput.value = 'Beer';
    nameInput.dispatchEvent(new Event('input'));
    select.value = select.options[7].value;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const button = hostElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeFalsy();
    button.click();

    expect(component.recipeSaved.emit).toHaveBeenCalledWith({
      title: 'Recipe',
      url: '',
      ingredients: [
        {
          name: 'Beer',
          amount: 1,
          unit: 'l',
          isStapleFood: false,
        }
      ]
    });

  });
});
