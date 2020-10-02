import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { DEFAULT_LANGUAGE } from '../../../shared/helpers/constants';
import { I18n, Language, Recipe } from '../../../shared/model/model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  @Input() translations: I18n = {};
  @Input() currentLang: Language = DEFAULT_LANGUAGE;
  @Input() recipes: Recipe[] | undefined;
  @Output() inputChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() editRecipe: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleteRecipe: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('searchField', {static: true, read: ElementRef}) searchField: ElementRef | undefined;

  destroy$: Subject<void> = new Subject();

  constructor() {
  }

  ngOnInit(): void {
    fromEvent<InputEvent>(this.searchField?.nativeElement, 'input').pipe(
      takeUntil(this.destroy$),
      debounceTime(500),
      distinctUntilChanged(),
      map((event: InputEvent) => (event?.target as HTMLInputElement).value)
    ).subscribe((value: string) => this.inputChanged.emit(value));
  }

  onEditRecipe(id: string | undefined): void {
    if (id) {
      this.editRecipe.emit(id);
    }
  }

  onDeleteRecipe(id: string | undefined): void {
    if (id) {
      this.deleteRecipe.emit(id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
