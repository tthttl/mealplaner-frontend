# Mealplaner

This project is part of the CAS FEE at HSR in 2020/21.

## Development server
Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
The backend repo must be checked out and started as well to be able to interact with the app locally.

## Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build
Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.
To create a build for qa run:`npm run build:qa`
To create a build for prod run: `npm run build:prod`

## Strict Mode
In this project angular strict mode is Enabled.
This means that TypeScript is in the strict mode, as well as other strictness flags recommended by the TypeScript team are enabled.
Specifically: forceConsistentCasingInFileNames, noImplicitReturns, noFallthroughCasesInSwitch.
This also turns on strict Angular compiler flags strictTemplates, strictInjectionParameters and strictInputAccessModifiers.

## Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Git Hooks
This project uses Husky 🐶 to prevent bad `git commit` and `git push` 
* Before every `git commit` linting is be executed. If linting fails the commit will abort, and you get an error message. If you get this error please fix all linting issues.
* Before every `git push` all unit tests get executed. If any test fail the push process wil abort, and you get an error message. If you get this error please fix all failing tests.

## Storybook
This project uses storybook to test and showcase the Basic Angular components isolated from the rest of the app. This helps us to build efficiently. 
Pages and Containers are not covered with storybook.
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
An detailed description of the authentication process is described here https://jasonwatmore.com/post/2020/05/22/angular-9-jwt-authentication-with-refresh-tokens#authentication-service-ts.


##Sizes
In this project we use rem as main Unit. 
There is a helper function which converts px to rems.
When writing css use this function.
Expect for the unit 1px. This gets to small when converting to rem. Therefore use 1px as px instead in this case.

##Colors
There is a predefined set of colors that build a defined color palette. Please use only colors that are defined as SCSS variables.

##PreLoading Strategy
There are some modules that depend on others. For example, the meal-planer modules needs the cookbook as well as the shopping-list to load recipes and add items to the shopping-list.
To keep the advantages from lazyloading a custom preloading strategy was implemented. The implemenation can be found in app/core/services/custom-preloading-strategy.service.ts
To define a dependence. Add the route to a module which also uses this module For example: the cookbook path: data: {usedBy: ['meal-planer']}.

##Open issues
- Offline functionality is only available at beta.mealplaner.app. 
- Resources, tokens and translations are correctly cached but urls unfortunately not always. => Site reload works unreliably. 
- Background synchronisation is only implemented on shopping-list screen. Scope: Creation, deletion, reordering of shopping-list items when offline are stored in indexed db 
then synchronised with the server as soon the app is online again. 
- Deleting Items allways takes 3 Seconds. If the user refreshes 


##Future Improvements
- Add an adding algorithm that checks if the items that is being added is already on the list and if so make an PATCH Request to change the quantity of this item. 
