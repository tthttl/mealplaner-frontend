import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MealplanerContainerComponent } from './mealplaner-container.component';

describe('MealplanerContainerComponent', () => {
  let component: MealplanerContainerComponent;
  let fixture: ComponentFixture<MealplanerContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealplanerContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealplanerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
