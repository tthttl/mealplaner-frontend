# Mealplaner

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Storybook
This project uses storybook to test and showcase the Angular components isolated from the rest of the app. This helps us to build efficiently. 
* To start storybook locally run `npm run storybook`
* The master branch is also deployed to storybook.mealplaner.app

## CI/CD

This application is set up with a CI/CD pipeline using GitLab CI. The pipeline does the follwing:
* Run `linting` and `unit testing` on every push 
* Deploy to staging area (beat.mealplaner.app) after merging to master.
* Deploy to production when creating a tag. 
