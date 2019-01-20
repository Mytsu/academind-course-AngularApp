import { MatSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class UIService {

  loadingStateChanged = new Subject<boolean>();

  constructor(private snackbar: MatSnackBar) {}

  showSnackBar(message: string, action: string, duration: number) {
    this.snackbar.open(message, action, { duration });
  }
}
