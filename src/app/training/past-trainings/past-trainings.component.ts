import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.scss']
})
export class PastTrainingsComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  private exercisesChanged: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  isLoading = false;
  private loadingSub: Subscription;

  constructor(private trainingService: TrainingService, private uiService: UIService) {}

  ngOnInit() {
    this.loadingSub = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.exercisesChanged = this.trainingService
      .finishedExercisesChanged
      .subscribe((exercises: Exercise[]) => {
      this.dataSource.data = exercises;
    });
    this.trainingService.fetchExercises();
  }

  ngOnDestroy() {
    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
    if (this.exercisesChanged) {
      this.exercisesChanged.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
