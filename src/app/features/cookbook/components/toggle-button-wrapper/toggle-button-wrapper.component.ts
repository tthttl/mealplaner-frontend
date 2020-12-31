import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { Observable, Observer } from 'rxjs';
import { DEFAULT_LANGUAGE } from '../../../../core/constants/constants';
import { I18n, Language } from '../../../../core/models/model';

@Component({
  selector: 'app-toggle-button-wrapper',
  templateUrl: './toggle-button-wrapper.component.html',
  styleUrls: ['./toggle-button-wrapper.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleButtonWrapperComponent),
      multi: true
    }
  ]
})
export class ToggleButtonWrapperComponent implements OnInit, ControlValueAccessor {

  @Input() translations: I18n | null = {};
  @Input() currentLanguage: Language | null = DEFAULT_LANGUAGE;
  @Input() mobileLabelKeyTrue = '';
  @Input() desktopLabelKeyTrue = '';
  @Input() mobileLabelKeyFalse = '';
  @Input() desktopLabelKeyFalse = '';
  @Input() maxWidth = '(max-width: 600px)';

  changingLabelTrue = '';
  changingLabelFalse = '';
  changingLabelTrue$: Observable<string> | undefined;
  changingLabelFalse$: Observable<string> | undefined;

  mediaQuery = window.matchMedia(`${this.maxWidth}`);

  selectedValue: boolean | undefined;

  ngOnInit(): void {
    this.changingLabelTrue = this.mediaQuery.matches ? this.mobileLabelKeyTrue : this.desktopLabelKeyTrue;
    this.changingLabelFalse = this.mediaQuery.matches ? this.mobileLabelKeyFalse : this.desktopLabelKeyFalse;
    this.changingLabelTrue$ = Observable.create((observer: Observer<string>) => {
      this.mediaQuery.addEventListener('change', (event: MediaQueryListEvent) => {
        if (event.matches) {
          observer.next(this.mobileLabelKeyTrue);
        } else {
          observer.next(this.desktopLabelKeyTrue);
        }
      });
    });
    this.changingLabelFalse$ = Observable.create((observer: Observer<string>) => {
      this.mediaQuery.addEventListener('change', (event: MediaQueryListEvent) => {
        if (event.matches) {
          observer.next(this.mobileLabelKeyFalse);
        } else {
          observer.next(this.desktopLabelKeyFalse);
        }
      });
    });
  }

  propagateChange = (value: boolean) => {
  }
  markAsTouched = () => {
  }

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
