import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { getWeekDayIndex, getFirstDateOfWeek } from '../../../../core/helpers/helpers';
import { I18n, Language, Meal } from '../../../../core/models/model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnChanges {
  @Input() selectedDate: Date | null | undefined;
  @Input() translations: I18n | null = null;
  @Input() currentLanguage: Language | null = null;
  @Input() meals: Meal[] = [];
  @Output() dateChanged: EventEmitter<Date> = new EventEmitter();

  sections = ['breakfast', 'lunch', 'dinner'];

  selectedDayIndex: number | undefined;
  selectedWeek: Date | undefined;

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
}
