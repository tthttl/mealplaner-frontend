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

## Git Hooks
This project uses Husky 🐶 to prevent bad `git commit` and `git push` 
* Before every `git commit` linting is be executed. If linting fails the commit will abort, and you get an error message. If you get this error please fix all linting issues.
* Before every `git push` all unit tests get executed. If any test fail the push process wil abort, and you get an error message. If you get this error please fix all failing tests.

## Storybook
This project uses storybook to test and showcase the Angular components isolated from the rest of the app. This helps us to build efficiently. 
* To start storybook locally run `npm run storybook`
* The master branch is also deployed to storybook.mealplaner.app

## CI/CD

This application is set up with a CI/CD pipeline using GitLab CI. The pipeline does the follwing:
* Run `linting` and `unit testing` on every push 
* Deploy to staging area (beat.mealplaner.app) after merging to master.
* Deploy to production when creating a tag. 

##APP Initialization
When the user calls or refreshes the page. The App gets initialized in the app.initializers.ts file. This file does the following:
* Try to relogin using the refresh token. (Detail Description in Authentication)
* Determines the preferred Language of the user based on his previous visit or browser Settings.
* Determines if the preferred language is supported. If not fallback to the default Language.
* Load the I18n for the determined language.

##Authentication
TODO
