import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DEFAULT_LANGUAGE } from '../../../shared/helpers/constants';
import { I18n, Language, Recipe } from '../../../shared/model/model';

@Component({
  selector: 'app-cookbook-page',
  templateUrl: './cookbook-page.component.html',
  styleUrls: ['./cookbook-page.component.scss']
})
export class CookbookPageComponent {

  @Input() translations: I18n | null = {};
  @Input() currentLang: Language | null = DEFAULT_LANGUAGE;
  @Input() recipes: Recipe[] | undefined | null;
  @Output() inputChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() editRecipe: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleteRecipe: EventEmitter<Recipe> = new EventEmitter<Recipe>();
  @Output() clickRecipe: EventEmitter<Recipe> = new EventEmitter<Recipe>();
  @Output() createRecipe: EventEmitter<void> = new EventEmitter<void>();

  onEditRecipe(id: string | undefined): void {
    if (id) {
      this.editRecipe.emit(id);
    }
  }

  onDeleteRecipe(recipe: Recipe): void {
    this.deleteRecipe.emit(recipe);
  }

  onClickRecipe(recipe: Recipe): void {
    this.clickRecipe.emit(recipe);
  }

  onInputChanged(searchTerm: string): void {
    this.inputChanged.emit(searchTerm);
  }

  click(): void {
    this.createRecipe.emit();
  }

}
