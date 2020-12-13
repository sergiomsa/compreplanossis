import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { getQueryParam } from '../helpers/url.helper';
import * as _ from 'lodash';

interface ILayoutConf {
  modulo_id?: number;
  navigationPos?: string;   // side, top
  sidebarStyle?: string;    // full, compact, closed
  dir?: string;             // ltr, rtl
  layoutInTransition?: boolean;
  isMobile?: boolean,
  useBreadcrumb?: boolean,
  breadcrumb?: string,      // simple, title
  topbarFixed?: boolean
}
interface ILayoutChangeOptions {
  duration?: number,
  transitionClass?: boolean
}
interface IAdjustScreenOptions {
  browserEvent?: any,
  route?: string
}


@Injectable()
export class LayoutService {
  public layoutConf: ILayoutConf;
  layoutConfSubject = new BehaviorSubject<ILayoutConf>(this.layoutConf);
  layoutConf$ = this.layoutConfSubject.asObservable();
  public isMobile: boolean;
  public currentRoute: string;
  public fullWidthRoutes = ['shop'];
  public modulos: any 	= [];
  constructor(
    private router: Router
  ) {
    this.setAppLayout();
  }

  setAppLayout() {
    this.modulos    		=  _.chain(JSON.parse(localStorage.getItem('modulos'))).toArray().sortBy().value(); 
    
    //******** SET YOUR LAYOUT OPTIONS HERE *********
    if  (this.modulos.length > 0)
    {
      this.layoutConf = {
        "modulo_id": this.modulos[0].id,
        "navigationPos": "side",
        "sidebarStyle": "full",
        "dir": "ltr",
        "useBreadcrumb": true,
        "topbarFixed": false,
        "breadcrumb": "title"
      }
    } else {
      this.layoutConf = {
        "navigationPos": "side",
        "sidebarStyle": "full",
        "dir": "ltr",
        "useBreadcrumb": true,
        "topbarFixed": false,
        "breadcrumb": "title"
      }
    } 
    //******* Only for demo purpose ***
    this.setLayoutFromQuery();
    //**********************
  }

  publishLayoutChange(lc: ILayoutConf, opt: ILayoutChangeOptions = {}) {
    let duration = opt.duration || 250;
    if (!opt.transitionClass) {
      this.layoutConf = Object.assign(this.layoutConf, lc);
      return this.layoutConfSubject.next(this.layoutConf);
    }

    this.layoutConf = Object.assign(this.layoutConf, lc, { layoutInTransition: true });
    this.layoutConfSubject.next(this.layoutConf);

    setTimeout(() => {
      this.layoutConf = Object.assign(this.layoutConf, { layoutInTransition: false });
      this.layoutConfSubject.next(this.layoutConf);
    }, duration);
  }

  setLayoutFromQuery() {
    let layoutConfString = getQueryParam('layout');
    try {
      this.layoutConf = JSON.parse(layoutConfString);
    } catch (e) { }
  }

  
  adjustLayout(options: IAdjustScreenOptions = {}) {
    let sidebarStyle: string;
    this.isMobile = this.isSm();
    this.currentRoute = options.route || this.currentRoute;
    sidebarStyle = this.isMobile ? 'closed' : 'full';

    if (this.currentRoute) {
      this.fullWidthRoutes.forEach(route => {
        if(this.currentRoute.indexOf(route) !== -1) {
          sidebarStyle =  'closed';
        }
      })
    }

    this.publishLayoutChange({
      isMobile: this.isMobile,
      sidebarStyle: sidebarStyle
    });
  }
  isSm() {
    return window.matchMedia(`(max-width: 959px)`).matches;
  }
}