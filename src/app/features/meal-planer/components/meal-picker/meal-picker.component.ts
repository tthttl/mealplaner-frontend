import {
  AfterViewInit, ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Cookbook, I18n, Language, Recipe, ShoppingListItem } from '../../../../core/models/model';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { INPUT_DEBOUNCE_TIME } from '../../../../core/constants/constants';

@Component({
  selector: 'app-meal-picker',
  templateUrl: './meal-picker.component.html',
  styleUrls: ['./meal-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MealPickerComponent implements OnChanges, AfterViewInit {
  @Input() recipes: {[key: string]: Recipe[]} | null | undefined = undefined;
  @Input() cookbooks: Cookbook[] | null = null;
  @Input() translations: I18n | null = null;
  @Input() preSelectedCookbookId: string | null | undefined = undefined;
  @Input() currentLanguage: Language | null  = null;
  @Output() selectRecipe: EventEmitter<Recipe> = new EventEmitter();
  @Output() changeSelectedCookbook: EventEmitter<string> = new EventEmitter();

  @ViewChild('mealFilter', { static: true }) mealFilterInput: ElementRef | undefined;

  selectedCookbookId: string | null = null;
  filter = '';

  get selectedCookBookRecipes(): Recipe[] | null {
    if (!this.recipes || !this.cookbooks) {
      return null;
    }


    if (!this.selectedCookbookId) {
      return null;
    }

    return this.recipes[this.selectedCookbookId]
      ?.filter( (recipe: Recipe) => recipe.title.toLowerCase().includes(this.filter.toLowerCase())) || null;
  }

  constructor() {
  }

  ngAfterViewInit(): void {
    fromEvent(this.mealFilterInput?.nativeElement, 'input')
      .pipe(
        debounceTime(INPUT_DEBOUNCE_TIME),
        map((inputEvent) => inputEvent as InputEvent),
        map((inputEvent) => {
          return (inputEvent?.target as HTMLInputElement).value;
        })
      )
      .subscribe((filter) => this.filter = filter);
  }

  ngOnChanges({preSelectedCookbookId}: SimpleChanges): void {
    if (preSelectedCookbookId?.currentValue) {
      this.selectedCookbookId = preSelectedCookbookId.currentValue;
    }
  }

  onAddRecipe(recipe: Recipe): void {
    this.selectRecipe.emit(recipe);
  }

  onChangeCookbook(selectedCookbookId: string): void {
    this.changeSelectedCookbook.emit(selectedCookbookId);
    this.selectedCookbookId = selectedCookbookId;
    this.filter = '';
  }

  getPageState(items: Recipe[] | null | undefined): string {
    if (items === null || items === undefined) {
      return 'loading';
    }

    if (items.length === 0 && this.filter) {
      return 'not-found';
    }

    if (items.length === 0) {
      return 'empty';
    }

    return 'default';
  }
}
