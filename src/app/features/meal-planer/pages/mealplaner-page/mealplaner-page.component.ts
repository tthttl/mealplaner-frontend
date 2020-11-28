import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { I18n, Language, List, Meal, MealPlaner, ShoppingList } from '../../../../core/models/model';

@Component({
  selector: 'app-mealplaner-page',
  templateUrl: './mealplaner-page.component.html',
  styleUrls: ['./mealplaner-page.component.scss']
})
export class MealplanerPageComponent implements OnInit {
  @Input() selectedDate: Date | null | undefined;
  @Input() translations: I18n | null = null;
  @Input() currentLanguage: Language | null = null;
  @Input() mealPlaners: MealPlaner[] | null = null;
  @Input() activeMealPlaner: MealPlaner | undefined | null = undefined;
  @Input() activeMealPlanerId: string | undefined | null = undefined;
  @Input() meals: Meal[] = [];
  @Output() dateChanged: EventEmitter<Date> = new EventEmitter();
  @Output() changeMealPlaner: EventEmitter<MealPlaner> = new EventEmitter();
  @Output() deleteMealPlaner: EventEmitter<MealPlaner> = new EventEmitter();
  @Output() editMealPlaner: EventEmitter<MealPlaner> = new EventEmitter();
  @Output() createMealPlaner: EventEmitter<MealPlaner> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onChangeWeekDay(weekDay: Date): void {
    this.dateChanged.emit(weekDay);
  }

  onSelectList(mealPlaner: MealPlaner): void {
    this.changeMealPlaner.emit(mealPlaner);
  }

  onEditList(mealPlaner: MealPlaner): void {
    this.editMealPlaner.emit(mealPlaner);
  }

  onDeleteList(mealPlaner: MealPlaner): void {
    this.deleteMealPlaner.emit(mealPlaner);

  }

  onCreateList(): void {
    this.createMealPlaner.emit();
  }
}
