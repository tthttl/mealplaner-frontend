import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-beta-teaser',
  templateUrl: './beta-teaser.component.html',
  styleUrls: ['./beta-teaser.component.scss']
})
export class BetaTeaserComponent implements OnInit {
  url = 'https://mealplaner.app';

  constructor(private location: Location) {
  }

  ngOnInit(): void {
    this.url = `https://mealplaner.app${this.location.path()}`;
  }

  onClick(): void {
  }
}
