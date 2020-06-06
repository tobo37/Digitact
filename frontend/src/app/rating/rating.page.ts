/**
 * @description
 *   This page handles the basic operation of navigation, close menu and validating of the rating pages.
 *
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { FormControl, FormGroup } from '../common/forms/forms';
import { hrRatingStep, hrRatingStepArr } from '../forms/model/steps.model';
// import { StorageHandlerService } from '../services/storage-handler.service';

import {
  ApplicantScore,
  ImpressionInfo,
  RatingForm,
} from './model/rating-form.model';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.page.html',
  styleUrls: ['./rating.page.scss'],
})
export class RatingPage implements OnDestroy, OnInit {
  constructor(
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private router: Router // private storage: StorageHandlerService
  ) {}

  /**
   * Make the Steps available in the template.
   *
   * This property is really only used to make the Steps available in the template.
   * In the TS file, you can directly refer to the underlying element.
   */
  readonly HR_RATING_STEP = hrRatingStep;

  /**
   * Make the Steps Array available in the template.
   *
   * This property is really only used to make the Steps available in the template.
   * In the TS file, you can directly refer to the underlying element.
   */
  readonly HR_RATING_STEP_ARR = hrRatingStepArr;

  /**
   * This property holds the type safe form group fields for applicant-score view.
   */
  ratingForm = new FormGroup<RatingForm>({
    applicantScore: new FormGroup<ApplicantScore>({
      rhetoric: new FormControl(undefined, Validators.required),
      motivation: new FormControl(undefined, Validators.required),
      selfAssurance: new FormControl(undefined, Validators.required),
      personalImpression: new FormControl(undefined, Validators.required),
    }),
    impressionInfo: new FormGroup<ImpressionInfo>({
      impression: new FormControl(undefined, Validators.required),
    }),
  });
  /**
   * Which step is currently displayed?
   *
   * **Important! Do not modify this value directly! Use `setCurrentStep()` instead!**
   */
  currentStep: hrRatingStep;
  /**
   * Which step is currently displayed?
   * This is the index in our array of steps.
   *
   * **Important! Do not modify this value directly! Use `setCurrentStep()` instead!**
   */
  currentStepIndex: number;

  /**
   * The current progress (between 0 and 1).
   */
  progressPercentage = 0;

  /**
   * Holds all the subscription which will be useful for un subscribing on destroy.
   */
  private subscriptions: Subscription[] = [];

  /**
   * In this method route change is observed and handling is done.
   */
  ngOnInit(): void {
    const routerSubscription = this.activatedRoute.queryParams.subscribe(
      (params) => {
        /*
          This Observable will also fire when the page is loaded.
          So, it allows us not only to react to changes of the query parameter,
          but also to set the initial query parameter.
       */
        this.handleStep(params.step);
      }
    );
    this.subscriptions.push(routerSubscription);

    const formStatusChangesSubscriptions = this.ratingForm.statusChanges.subscribe(
      () => {
        /*
          This Observable fires every time the validity status recalculates.
          So, it will basically fire whenever someone enters some data somewhere.
          (To be more precise: It might fire even more often than that.)
          So, we can use it to update our progress bar.
          Of course, there is still room for performance improvement (since we will call the following method really often).
          But for now, it should be fine.
        */
        this.updateProgessStatus();
      }
    );
    this.subscriptions.push(formStatusChangesSubscriptions);
  }

  /**
   * Unsubscribe from all of our Subscriptions.
   */
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Handle a Step as provided by the Router.
   *
   * The string provided by the Router could contain anything.
   * So: If the Step is not known, we simply show the Basic Information step.
   *
   * (When navigating to the URL without providing a query parameter, we will also redirect to the Basic Information step).
   *
   * @param step The "step" query parameter we got from the Router.
   */
  private handleStep(step: unknown): void {
    // tslint:disable-next-line: no-any
    if (hrRatingStepArr.includes(step as any)) {
      this.setCurrentStep(step as hrRatingStep);
      return;
    }

    if (step) {
      console.warn('The following Step is unknown:', step);
    }

    // A fallback: If a step was requested that we don't know, we simply show the Basic Information page.
    this.navigateToStep(hrRatingStep.ApplicantRating);
  }

  /**
   * Set the currentStep and currentStepIndex property.
   *
   * Usually, if you want to change the Step, you should use the Router.
   */
  private setCurrentStep(step: hrRatingStep): void {
    this.currentStep = step;
    this.currentStepIndex = hrRatingStepArr.indexOf(step);
  }

  /**
   * Update the "step" query parameter.
   * You can use this to navigate between the different form steps!
   */
  navigateToStep(step: hrRatingStep): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        step,
      },
    });
  }

  /**
   * In this method navigation to next step is handled.
   */
  navigateToNextStep(): void {
    if (this.currentStepIndex < hrRatingStepArr.length - 1) {
      const step = hrRatingStepArr[this.currentStepIndex + 1];
      this.navigateToStep(step);

      return;
    }

    console.warn('There is no next step.');
  }
  /**
   * In this method navigation to home page is handled.
   */
  goToHomePage(): void {
    this.navController.navigateBack('/home');
  }

  finalize(): void {
    // this.storage.addItem(key, this.ratingForm.value);
    this.router.navigate(['/home']);
  }
  /**
   * Update the value of our progress counter.
   */
  updateProgessStatus(): void {
    // Don't count the submit page.
    const totalNumberOfSteps = hrRatingStepArr.length - 1;

    let validSteps = 0;
    for (const control of Object.values(this.ratingForm.controls)) {
      if (control.valid) {
        validSteps++;
      }
    }
    this.progressPercentage = validSteps / totalNumberOfSteps;
  }
}
