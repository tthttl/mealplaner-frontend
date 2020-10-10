import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { SharedModule } from '../../../shared/shared.module';

import { RecipeFormComponent } from './recipe-form.component';

describe('RecipeFormComponent', () => {
  let component: RecipeFormComponent;
  let fixture: ComponentFixture<RecipeFormComponent>;
  // tslint:disable-next-line:no-any
  let hostElement: any;

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
    hostElement = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submit button should be disabled when inputs are empty', () => {
    const button = hostElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTruthy();

  });

  it('new ingredient button should be disabled when amount is invalid', () => {
    const button = hostElement.querySelector('button.icon-wrapper');
    const amountInput = hostElement.querySelector('input[ng-reflect-name="amount"]');
    const titelInput = hostElement.querySelector('.ingredients input[ng-reflect-name="title"]');
    amountInput.value = 0;
    amountInput.dispatchEvent(new Event('input'));
    titelInput.value = 'Beer';
    titelInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(button.disabled).toBeTruthy();

  });

  it('new ingredient button should be disabled when name is empty', () => {
    const button = hostElement.querySelector('button.icon-wrapper');
    const amountInput = hostElement.querySelector('input[ng-reflect-name="amount"]');
    amountInput.value = 1;
    amountInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(button.disabled).toBeTruthy();

  });

  it('should emit Recipe when inputs are filled and submit is clicked', () => {
    spyOn(component.recipeSaved, 'emit');
    const titleInput = hostElement.querySelector('input[ng-reflect-name="title"]');
    const amountInput = hostElement.querySelector('input[ng-reflect-name="amount"]');
    const ingredientTitle = hostElement.querySelector('.ingredients input[ng-reflect-name="title"]');
    const select = hostElement.querySelector('select');

    titleInput.value = 'Recipe';
    titleInput.dispatchEvent(new Event('input'));
    amountInput.value = 1;
    amountInput.dispatchEvent(new Event('input'));
    ingredientTitle.value = 'Beer';
    ingredientTitle.dispatchEvent(new Event('input'));
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
          title: 'Beer',
          amount: 1,
          unit: 'l',
          isStapleFood: false,
        }
      ]
    });

  });

  it('inputs should be pre-filled when recipe is supplied as input', () => {
    spyOn(component.recipeSaved, 'emit');
    component.recipe = {
      title: 'Recipe',
      url: 'URL',
      ingredients: [
        {
          title: 'Beer',
          amount: 1,
          unit: 'l',
          isStapleFood: false,
        }
      ]
    };
    component.ngOnInit();
    fixture.detectChanges();
    const button = hostElement.querySelector('button[type="submit"]');
    button.click();

    expect(component.recipeSaved.emit).toHaveBeenCalledWith({
      title: 'Recipe',
      url: 'URL',
      ingredients: [
        {
          title: 'Beer',
          amount: 1,
          unit: 'l',
          isStapleFood: false,
        }
      ]
    });
  });
});
