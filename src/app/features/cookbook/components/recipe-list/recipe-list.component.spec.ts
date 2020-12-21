import { APP_INITIALIZER } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Recipe } from '../../../../core/models/model';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { SharedModule } from '../../../../shared/shared.module';

import { RecipeListComponent } from './recipe-list.component';
import { formData } from './recipe-list.stories';

describe('RecipeListComponent', () => {
  let component: RecipeListComponent;
  let fixture: ComponentFixture<RecipeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [RecipeListComponent, TranslatePipe],
      providers: [
        {
          provide: TranslatePipe,
          useClass: TranslatePipe
        },
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
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display list', () => {
    component.recipes = formData.recipes as Recipe[];
    component.translations = formData.translations;
    fixture.detectChanges();

    const recipeRows = fixture.debugElement.queryAll(By.css('.recipe-list__row'));
    expect(recipeRows?.length).toEqual(3);
  });

  it('should emit edit', () => {
    spyOn(component.editRecipe, 'emit');
    component.recipes = [formData.recipes[0]] as Recipe[];
    component.translations = formData.translations;
    fixture.detectChanges();

    const editButton = fixture.nativeElement
      .querySelector('button[data-test="RECIPE-ROW-EDIT"]');

    editButton.click();

    expect(component.editRecipe.emit).toHaveBeenCalledWith(formData.recipes[0] as Recipe);
  });

  it('should emit deleteRecipe', () => {
    spyOn(component.deleteRecipe, 'emit');
    component.recipes = [formData.recipes[0]] as Recipe[];
    component.translations = formData.translations;
    fixture.detectChanges();

    const deleteButton = fixture.nativeElement
      .querySelector('button[data-test="RECIPE-ROW-DELETE"]');

    deleteButton.click();

    expect(component.deleteRecipe.emit).toHaveBeenCalledWith(formData.recipes[0] as Recipe);
  });

  it('should emit clickRecipe', () => {
    spyOn(component.clickRecipe, 'emit');
    component.recipes = [formData.recipes[0]] as Recipe[];
    component.translations = formData.translations;
    fixture.detectChanges();

    const recipe = fixture.nativeElement
      .querySelector('.recipe-list__title-box');

    recipe.click();

    expect(component.clickRecipe.emit).toHaveBeenCalledWith(formData.recipes[0] as Recipe);
  });
});
