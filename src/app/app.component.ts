import { Component } from '@angular/core';
import {environment} from '../environments/environment';
import { ShoppingListItem } from './shared/model/model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mealplaner';
  showBetaTeaser = environment.showBetaTeaser;
  items: ShoppingListItem[] = [
    {id: '1', name: 'Mehl', amount: 1, unit: 'kg', isChecked: false},
    {id: '2', name: 'Zucker', amount: 50, unit: 'g', isChecked: false},
    {id: '3', name: 'Eier', amount: 1, unit: 'piece', isChecked: false},
    {id: '4', name: 'Slaz', amount: 5, unit: 'coffeeSpoon', isChecked: false},
    {id: '4', name: 'Slaz', amount: 5, unit: 'coffeeSpoon', isChecked: false},
    {id: '4', name: 'Slaz', amount: 5, unit: 'coffeeSpoon', isChecked: false},
    {id: '4', name: 'Slaz', amount: 5, unit: 'coffeeSpoon', isChecked: false},
    {id: '4', name: 'Slaz', amount: 5, unit: 'coffeeSpoon', isChecked: false},
    {id: '4', name: 'Slaz', amount: 5, unit: 'coffeeSpoon', isChecked: false},
    {id: '4', name: 'Slaz', amount: 5, unit: 'coffeeSpoon', isChecked: false},
    {id: '4', name: 'Slaz', amount: 5, unit: 'coffeeSpoon', isChecked: false},
    {id: '4', name: 'Slaz', amount: 5, unit: 'coffeeSpoon', isChecked: false},
    {id: '4', name: 'Slaz', amount: 5, unit: 'coffeeSpoon', isChecked: false},
    {id: '4', name: 'Slaz', amount: 5, unit: 'coffeeSpoon', isChecked: false},
  ];
}
