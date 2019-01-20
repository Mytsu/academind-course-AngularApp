import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import * as fromRoot from '../../app.reducer';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {

  @Output() trainingStart = new EventEmitter<void>();
  exercises: Exercise[];
  exerciseSubscription: Subscription;

  isLoading$: Observable<boolean>;
  /* private loadingSub: Subscription; */

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.isLoading$ = this.store.pipe(select(fromRoot.getIsLoading));
    /* this.loadingSub = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    }); */
    this.exerciseSubscription = this.trainingService
      .exercisesChanged.subscribe(exercises => this.exercises = exercises);
    this.fetchExercises();
  }

  /* ngOnDestroy() {
    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
  } */

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

}
