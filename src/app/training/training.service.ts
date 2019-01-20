import { Exercise } from './exercise.model';
import { Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { UIService } from '../shared/ui.service';

@Injectable()
export class TrainingService {

  private runningExercise: Exercise;
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private fbSubs: Subscription[] = [];

  private availableExercises: Exercise[];

  constructor(private db: AngularFirestore, private uiService: UIService) {}

  fetchAvailableExercises() {
    this.uiService.loadingStateChanged.next(true);
    this.fbSubs.push(this.db.collection('availableExercises')
      .snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as Exercise;
        });
      }))
      .subscribe((exercises: Exercise[]) => {
        this.uiService.loadingStateChanged.next(false);
        this.availableExercises = exercises;
        this.exercisesChanged.next([ ...this.availableExercises ]);
      }, error => {
        // console.log(error);
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackBar('Fetching exercises failed, please try again later.', null, 3000);
      }));
  }

  startExercise(selectedId: string) {
    /* this.db.doc('availableExercises/' + selectedId)
    .update({
      lastSelected: new Date()
    }); */
    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  get RunningExercise() {
    return { ...this.runningExercise };
  }

  completeExercise() {
    this.addDataToDb({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDb({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'canceled' });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  fetchExercises() {
    this.uiService.loadingStateChanged.next(true);
    this.fbSubs.push(this.db.collection('finishedExercises')
    .valueChanges()
    .subscribe((exercises: Exercise[]) => {
      this.uiService.loadingStateChanged.next(false);
      this.finishedExercisesChanged.next(exercises);
    }/* , error => {
      // console.log(error);
    } */));
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDb(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

}
