import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
/* import { UIService } from 'src/app/shared/ui.service'; */
import { /* Subscription, */ Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  maxDate: Date;
  isLoading$: Observable<boolean>;
  /* private loadingSubs: Subscription; */

  constructor(
    private authService: AuthService,
    /* private uiService: UIService, */
    private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.isLoading$ = this.store.pipe(select(fromRoot.getIsLoading));
    /* this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    }); */
    this.maxDate = new Date;
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(form: NgForm) {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password
    });
  }

}
