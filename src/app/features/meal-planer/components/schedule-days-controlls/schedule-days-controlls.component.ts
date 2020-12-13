import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { I18n, Language } from '../../../../core/models/model';

@Component({
  selector: 'app-schedule-days-controlls',
  templateUrl: './schedule-days-controlls.component.html',
  styleUrls: ['./schedule-days-controlls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleDaysControllsComponent implements OnInit {
  @Input() selectedDayIndex: number | undefined;
  @Input() translations: I18n | null = null;
  @Input() currentLanguage: Language | null = null;
  @Input() currentDayIndex: boolean | number = false;
  @Output() changeDayIndex: EventEmitter<number> = new EventEmitter();

  days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  constructor() { }

  ngOnInit(): void {
  }

  selectDay(selectedDayIndex: number): void {
    this.changeDayIndex.emit(selectedDayIndex);
  }
}
