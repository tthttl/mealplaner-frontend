import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DEFAULT_LANGUAGE } from '../../../../core/constants/constants';
import { Cookbook, I18n, Language, List, Recipe } from '../../../../core/models/model';

@Component({
  selector: 'app-cookbook-page',
  templateUrl: './cookbook-page.component.html',
  styleUrls: ['./cookbook-page.component.scss']
})
export class CookbookPageComponent {
  @Input() translations: I18n | null = {};
  @Input() currentLanguage: Language | null = DEFAULT_LANGUAGE;
  @Input() recipes: Recipe[] | undefined | null;
  @Input() cookbooks: Cookbook[] | undefined | null;
  @Input() selectedCookbook: Cookbook | undefined | null;
  @Output() searchStringChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() editRecipe: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleteRecipe: EventEmitter<Recipe> = new EventEmitter<Recipe>();
  @Output() clickRecipe: EventEmitter<Recipe> = new EventEmitter<Recipe>();
  @Output() createRecipe: EventEmitter<void> = new EventEmitter<void>();
  @Output() createCookbook: EventEmitter<undefined> = new EventEmitter();
  @Output() selectCookbook: EventEmitter<List> = new EventEmitter();
  @Output() editCookbook: EventEmitter<List> = new EventEmitter();
  @Output() deleteCookbook: EventEmitter<List> = new EventEmitter();

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
    this.searchStringChanged.emit(searchTerm);
  }

  click(): void {
    this.createRecipe.emit();
  }

  onCreateCookbook(): void {
    this.createCookbook.emit();
  }

  onSelectCookbook(list: List): void {
    this.selectCookbook.emit(list);
  }

  onEditCookbook(list: List): void {
    this.editCookbook.emit(list);
  }

  onDeleteCookbook(list: List): void {
    this.deleteCookbook.emit(list);
  }
}
