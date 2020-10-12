import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { I18n, Language, SelectOption, ShoppingListItem, Unit } from '../../../shared/model/model';
import { DEFAULT_LANGUAGE } from '../../../shared/helpers/constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { translateValidationErrors } from '../../../shared/helpers/helpers';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';

@Component({
  selector: 'app-shopping-list-form',
  templateUrl: './shopping-list-form.component.html',
  styleUrls: ['./shopping-list-form.component.scss']
})
export class ShoppingListFormComponent implements OnInit {
  @Input() translations: I18n = {};
  @Input() currentLang: Language = DEFAULT_LANGUAGE;
  @Output() itemAdded: EventEmitter<ShoppingListItem> = new EventEmitter();

  addItemForm: FormGroup;

  units: SelectOption<Unit>[] = [];

  constructor(private translatePipe: TranslatePipe) {
    this.addItemForm = new FormGroup({
      amount:  new FormControl('', [
        Validators.required,
      ]),
      unit:  new FormControl('pack', [
        Validators.required,
      ]),
      title:  new FormControl('', [
        Validators.required,
      ]),
    });
  }

  ngOnInit(): void {
    this.units = [
      {value: 'pack', key: this.translatePipe.transform('shoppingList.addForm.pack', this.translations, this.currentLang)},
      {value: 'piece', key: this.translatePipe.transform('shoppingList.addForm.piece', this.translations, this.currentLang)},
      {value: 'kg', key: 'kg'},
      {value: 'g', key: 'g'},
      {value: 'l', key: 'l'},
      {value: 'dl', key: 'dl'},
    ];
  }

  getFormControl(key: string): FormControl {
    return this.addItemForm?.controls[key] as FormControl;
  }

  onSubmit(): void {
    this.itemAdded.emit(this.addItemForm?.value);
  }

  getErrorsFor(key: string): string[] {
    return translateValidationErrors(
      this.getFormControl(key),
      this.translatePipe,
      this.translations,
      this.currentLang);
  }
}
