import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideRightAnimation } from './routerAnimations'
import { Title } from '@angular/platform-browser'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations : [slideRightAnimation]
})
export class AppComponent {
  title = 'DPHelper';
  currentId = 1;

  constructor(private titleService: Title){
    titleService.setTitle(this.title);
  }

  /*getAnimationState(outlet: RouterOutlet): boolean{
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }*/
}
