import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DayPlan, I18n, Language, Meal, MealPlaner, MealType } from '../../../../core/models/model';

@Component({
  selector: 'app-mealplaner-page',
  templateUrl: './mealplaner-page.component.html',
  styleUrls: ['./mealplaner-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MealplanerPageComponent implements OnInit {
  @Input() selectedDate: Date | null | undefined;
  @Input() translations: I18n | null = null;
  @Input() currentLanguage: Language | null = null;
  @Input() mealPlaners: MealPlaner[] | null = null;
  @Input() activeMealPlaner: MealPlaner | undefined | null = undefined;
  @Input() activeMealPlanerId: string | undefined | null = undefined;
  @Input() dayPlan: DayPlan | null | undefined = null;
  @Input() isOffline: boolean | null = false;
  @Output() dateChanged: EventEmitter<Date> = new EventEmitter();
  @Output() changeMealPlaner: EventEmitter<MealPlaner> = new EventEmitter();
  @Output() deleteMealPlaner: EventEmitter<MealPlaner> = new EventEmitter();
  @Output() editMealPlaner: EventEmitter<MealPlaner> = new EventEmitter();
  @Output() createMealPlaner: EventEmitter<MealPlaner> = new EventEmitter();
  @Output() addMeal: EventEmitter<MealType> = new EventEmitter();
  @Output() removeMeal: EventEmitter<Meal> = new EventEmitter();

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

  onAddMeal(mealType: MealType): void {
    this.addMeal.emit(mealType);
  }

  onRemoveMeal(meal: Meal): void {
    this.removeMeal.emit(meal);
  }
}
