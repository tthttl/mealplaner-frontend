import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { DEFAULT_LANGUAGE } from '../../../../core/constants/constants';
import { translateValidationErrors } from '../../../../core/helpers/helpers';
import { BasicShoppingListItem, I18n, Language, SelectOption, Unit } from '../../../../core/models/model';

@Component({
  selector: 'app-shopping-list-form',
  templateUrl: './shopping-list-form.component.html',
  styleUrls: ['./shopping-list-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShoppingListFormComponent implements OnInit {
  @Input() translations: I18n | null = {};
  @Input() currentLang: Language | null = DEFAULT_LANGUAGE;
  @Output() itemAdded: EventEmitter<BasicShoppingListItem> = new EventEmitter();

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
    this.restForm();
  }

  restForm(): void {
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

  getErrorsFor(key: string): string[] {
    return translateValidationErrors(
      this.getFormControl(key),
      this.translatePipe,
      this.translations,
      this.currentLang);
  }
}
