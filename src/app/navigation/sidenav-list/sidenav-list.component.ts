import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription, Observable } from 'rxjs';
import * as fromRoot from '../../app.reducer';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  isAuth$: Observable<boolean>;
  authSubscription: Subscription;

  @Output()
  sidenavToggle = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.isAuth$ = this.store.pipe(select(fromRoot.getIsAuthenticated));
  }

  onClose() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }

}
