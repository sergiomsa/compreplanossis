import { Component, OnInit, Input } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { Subscription } from "rxjs";
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.template.html'
})
export class SidenavComponent {

  private layoutConfSub: Subscription;
  modulo_id: any;
  programas: any 	= [];
  menuItems: any  = [];

  public layoutConf:any;

  @Input('items') public menuItemsall: any[] = [];
  @Input('hasIconMenu') public hasIconTypeMenuItem: boolean;
  @Input('iconMenuTitle') public iconTypeMenuTitle: string;

  constructor(private layout: LayoutService,private router:Router) {}
  ngOnInit() {
    
    this.layoutConf   = this.layout.layoutConf;
    this.modulo_id    = this.layoutConf.modulo_id;
    this.programas 		= this.menuItemsall;
 	  const result 			= this.programas.filter(programa => {
		  if (programa.modulo_id === this.modulo_id)
		  {			  
			  return true;
		  }
		  return false;
	  });
	  this.menuItems		=  result;
  }

  ngAfterViewInit() {
    this.layoutConfSub = this.layout.layoutConf$.subscribe(change => {
      if (change.modulo_id != this.modulo_id)
      {
        this.modulo_id    = change.modulo_id;
        this.programas 		= this.menuItemsall;
        const result 			= this.programas.filter(programa => {
          if (programa.modulo_id === this.modulo_id)
          {			  
            return true;
          }
          return false;
        });
        this.menuItems		=  result;
        this.router.navigate(['/dashboard']) ;
      }
    })
  }
  
}