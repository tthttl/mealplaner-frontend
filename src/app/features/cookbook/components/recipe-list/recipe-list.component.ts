import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { DEBOUNCE_TIME, DEFAULT_LANGUAGE } from '../../../../core/constants/constants';
import { I18n, Language, Recipe } from '../../../../core/models/model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  @Input() translations: I18n | null = {};
  @Input() currentLang: Language | null = DEFAULT_LANGUAGE;
  @Input() recipes: Recipe[] | undefined | null;
  @Output() inputChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() editRecipe: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleteRecipe: EventEmitter<Recipe> = new EventEmitter<Recipe>();
  @Output() clickRecipe: EventEmitter<Recipe> = new EventEmitter<Recipe>();

  @ViewChild('searchField', {static: true, read: ElementRef}) searchField: ElementRef | undefined;

  destroy$: Subject<void> = new Subject();

  constructor() {
  }

  ngOnInit(): void {
    fromEvent<InputEvent>(this.searchField?.nativeElement, 'input').pipe(
      takeUntil(this.destroy$),
      debounceTime(DEBOUNCE_TIME),
      distinctUntilChanged(),
      map((event: InputEvent) => (event?.target as HTMLInputElement).value)
    ).subscribe((value: string) => this.inputChanged.emit(value));
  }

  onEditRecipe(id: string | undefined): void {
    if (id) {
      this.editRecipe.emit(id);
    }
  }

  onDeleteRecipe(recipe: Recipe): void {
      this.deleteRecipe.emit(recipe);
  }

  onClick(recipe: Recipe): void {
    this.clickRecipe.emit(recipe);
  }

  getPageState(items: Recipe[] | null | undefined): string {
    if (items === null || items === undefined) {
      return 'loading';
    }

    if (items.length === 0) {
      return 'empty';
    }

    return 'default';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
