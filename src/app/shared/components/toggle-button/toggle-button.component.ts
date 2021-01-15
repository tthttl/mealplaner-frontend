import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { fromEvent, Observable } from 'rxjs';
import { DEFAULT_LANGUAGE } from '../../../core/constants/constants';
import { Language } from '../../../core/models/model';
import { pluck, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleButtonComponent),
      multi: true
    }
  ]
})
export class ToggleButtonComponent implements OnInit, ControlValueAccessor {

  @Input() mobileLabelTrue = '';
  @Input() desktopLabelTrue = '';
  @Input() mobileLabelFalse = '';
  @Input() desktopLabelFalse = '';
  @Input() maxWidth = '(max-width: 600px)';

  mediaQuery = window.matchMedia(`${this.maxWidth}`);
  showMobileText$: Observable<boolean | unknown> = fromEvent( this.mediaQuery, 'change').pipe(
    pluck('matches'),
    startWith(this.mediaQuery.matches),
  );

  selectedValue: boolean | undefined;

  ngOnInit(): void {
  }

  propagateChange = (value: boolean) => {};
  markAsTouched = () => {};

  registerOnChange(fn: () => {}): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.markAsTouched = fn;
  }

  changed(event: MatButtonToggleChange): void {
    this.markAsTouched();
    this.propagateChange(event.value);
  }

  writeValue(event: MatButtonToggleChange | boolean): void {
    if (typeof event === 'object') {
      this.selectedValue = event.value;
    } else {
      this.selectedValue = event;
    }
  }

}
