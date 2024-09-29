import { BaseRouteReuseStrategy, RouteReuseStrategy } from '@angular/router'
import { ActivatedRouteSnapshot, DetachedRouteHandle} from '@angular/router'

export class ReuseStrategyOwn implements RouteReuseStrategy{

  shouldDetach(route: ActivatedRouteSnapshot): boolean{
    return false;
  }

  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void{
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean{
    return false;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null{
    return null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean{
    return false;
  }

}