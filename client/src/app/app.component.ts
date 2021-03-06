import { Component, ElementRef, Renderer2, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { filter, take, delay, skip } from 'rxjs/operators';
import { of } from 'rxjs';

import { TranslateService } from './services/translate.service';
import * as fromRoot from './store/reducers';
import * as actions from './store/actions';
import { User } from './shared/models';

@Component({
  selector    : 'app-root',
  templateUrl : './app.component.html',
  styleUrls   : ['./app.component.scss']
})
export class AppComponent {

  rememberScroll  : {[component: string]: number} = {};
  position = 0;

  constructor(
    private elRef     : ElementRef,
    private renderer  : Renderer2,
    private store     : Store<fromRoot.State>,
    private translate : TranslateService,
    @Inject(PLATFORM_ID)
    private platformId : Object) {

    this.translate.languageSub$
      .pipe(filter(Boolean), take(1))
      .subscribe((lang: string) => {
        const langUpdate = {
          lang,
          currency  : lang === 'cs' ? 'CZK' : 'EUR'
        };
        this.store.dispatch(new actions.ChangeLanguage(langUpdate));
    });

    this.store.select(fromRoot.getLang)
      .pipe(filter(Boolean), skip(1))
      .subscribe((lang: string) => {
        translate.use(lang);
    });

    this.store.pipe(select(fromRoot.getPosition))
      .pipe(filter(Boolean))
      .subscribe((componentPosition: {[component: string]: number}) => {
        this.rememberScroll = {...this.rememberScroll, ...componentPosition};
        this.renderer.setProperty(this.elRef.nativeElement.querySelector('.main-scroll-wrap'), 'scrollTop', 0);
    });

    this.store.select(fromRoot.getUser).pipe(filter(() => isPlatformBrowser(this.platformId)), take(1))
      .subscribe(user => {
        if (!user) {
          this.store.dispatch(new actions.GetUser());
        }
    });

    this.store.select(fromRoot.getUser)
      .subscribe((user: User) => {
      if (user && user.accessToken && isPlatformBrowser(this.platformId)) {
        localStorage.setItem('accessToken', user.accessToken);
      }

      if (user && user.email) {
        this.store.dispatch(new actions.GetUserOrders());
      }
    });

    this.store.select(fromRoot.getCart).pipe(filter(() => isPlatformBrowser(this.platformId)), take(1))
      .subscribe(cart => {
      if (!cart) {
        this.store.dispatch(new actions.GetCart());
      }
    });
  }

  onScrolling(event: Event): void {
    this.position = event['target']['scrollTop'];
  }

  onActivate(component: string): void {
    const currentComponent = component['component'];
    const position = (currentComponent && this.rememberScroll[currentComponent])
      ? this.rememberScroll[currentComponent]
      : 0;

    of('activate_event').pipe(delay(5), take(1)).subscribe(() => {
      this.renderer.setProperty(this.elRef.nativeElement.querySelector('.main-scroll-wrap'), 'scrollTop', position)
    })
  }

  onDeactivate(component: string): void {
    if (Object.keys(component).includes('component')) {
      const currentComponent = component['component'];
      this.rememberScroll = {...this.rememberScroll, [currentComponent]: this.position};
    }
  }

}
