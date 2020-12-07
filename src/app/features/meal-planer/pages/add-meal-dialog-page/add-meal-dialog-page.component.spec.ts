import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMealDialogPageComponent } from './add-meal-dialog-page.component';

describe('AddMealDialogPageComponent', () => {
  let component: AddMealDialogPageComponent;
  let fixture: ComponentFixture<AddMealDialogPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMealDialogPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMealDialogPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
