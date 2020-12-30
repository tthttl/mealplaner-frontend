import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { differenceInCalendarWeeks, differenceInDays } from 'date-fns';
import { getFirstDateOfWeek, getWeekDayIndex } from '../../../../core/helpers/helpers';
import { DayPlan, I18n, Language, Meal, MealType } from '../../../../core/models/model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleComponent implements OnInit, OnChanges {
  @Input() selectedDate: Date | null | undefined;
  @Input() translations: I18n | null = null;
  @Input() currentLanguage: Language | null = null;
  @Input() dayPlan: DayPlan | undefined | null = null;
  @Input() isOffline: boolean | null = false;
  @Output() dateChanged: EventEmitter<Date> = new EventEmitter();
  @Output() addMeal: EventEmitter<MealType> = new EventEmitter();
  @Output() removeMeal: EventEmitter<Meal> = new EventEmitter();

  sections: MealType[] = ['breakfast', 'lunch', 'dinner'];

  selectedDayIndex: number | undefined;
  selectedWeek: Date | undefined;
  today = new Date();

  get currentTodayIndex(): number {
    const today = this.today.getDay() - 1;
    return today >= 0 ? today : 6;
  }

  get displayedDayIsPast(): boolean {
    return differenceInDays(this.selectedDate || new Date(), this.today) < 0;
  }

  get displayedWeekIsActiveWeek(): boolean {
    return differenceInCalendarWeeks(this.selectedDate || new Date(), this.today, {weekStartsOn: 1}) === 0;
  }

  constructor() {
  }

  ngOnChanges(): void {
    if (this.selectedDate) {
      this.selectedDayIndex = getWeekDayIndex(this.selectedDate);
      this.selectedWeek = getFirstDateOfWeek(new Date(this.selectedDate));
    }
  }

  ngOnInit(): void {
  }

  onDateChange(date: Date): void {
    this.dateChanged.emit(date);
  }


  onChangeWeekDay(weekDayIndex: number): void {
    if (this.selectedWeek) {
      const selectedDate = new Date(this.selectedWeek);
      selectedDate.setDate(selectedDate.getDate() + weekDayIndex);
      this.dateChanged.emit(selectedDate);
    }
  }

  onRemoveMeal(meal: Meal): void {
    this.removeMeal.emit(meal);
  }
}
