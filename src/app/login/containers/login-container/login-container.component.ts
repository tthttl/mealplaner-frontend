import { Component, OnInit } from '@angular/core';
import { LoginCredentials } from '../../../shared/model/model';

@Component({
  selector: 'app-login-container',
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.scss']
})
export class LoginContainerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  login(credentials: LoginCredentials): void {
    console.log(credentials);
  }
}
