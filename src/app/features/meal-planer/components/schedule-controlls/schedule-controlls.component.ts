import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getFirstDateOfWeek } from '../../../../core/helpers/helpers';
import { I18n, Language } from '../../../../core/models/model';

@Component({
  selector: 'app-schedule-controlls',
  templateUrl: './schedule-controlls.component.html',
  styleUrls: ['./schedule-controlls.component.scss']
})
export class ScheduleControllsComponent implements OnInit {
  @Input() selectedDate: Date | undefined | null;
  @Input() translations: I18n | null = null;
  @Input() currentLanguage: Language | null = null;
  @Output() dateChanged: EventEmitter<Date> = new EventEmitter();

  // tslint:disable-next-line:variable-name
  private _weekOffset = 0;

  get weekOffset(): number {
    return this._weekOffset;
  }

  set weekOffset(offset: number) {
    this._weekOffset = offset;
    const startOfWeek = getFirstDateOfWeek(new Date());
    const startDate = (
      new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate())
    );
    startDate.setDate(startDate.getDate() + (this._weekOffset * 7));
    this.dateChanged.emit(startDate);
  }

  constructor() {
  }

  ngOnInit(): void {
  }
}
