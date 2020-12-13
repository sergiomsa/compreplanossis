import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

interface IMenuItem {
  type: string,       // Possible values: link/dropDown/icon/separator/extLink
  modulo_id?: number,     // Used as display text for item and title for separator type
  name?: string,      // Used as display text for item and title for separator type
  state?: string,     // Router state
  icon?: string,      // Material icon name
  tooltip?: string,   // Tooltip text 
  disabled?: boolean, // If true, item will not be appeared in sidenav.
  sub?: IChildItem[], // Dropdown items
  badges?: IBadge[]
}
interface IChildItem {
  type?: string,
  name: string,       // Display text
  state?: string,     // Router state
  icon?: string,
  sub?: IChildItem[]
}

interface IBadge {
  color: string;      // primary/accent/warn/hex color codes(#fff000)
  value: string;      // Display text
}

@Injectable()
export class NavigationService {
  constructor() { }

  iconMenu: IMenuItem[] =  _.chain(JSON.parse(localStorage.getItem('programas'))).toArray().sortBy().value();  
   /*
  [
    {
      modulo_id: 1,
      name: 'DASHBOARD',
      type: 'link',
      tooltip: 'Dashboard',
      icon: 'dashboard',
      state: 'dashboard'
    },
	{
	  modulo_id: 1,
      name: 'Modulos',
      type: 'link',
      tooltip: 'Modulos',
      icon: 'local_cafe',
      state: 'modulos/lista'
    },
	{
	  modulo_id: 1,
      name: 'Programas',
      type: 'link',
      tooltip: 'Programas',
      icon: 'apps',
      state: 'programas/lista'
    },
    {
   	  modulo_id: 1,
      name: 'Papéis',
      type: 'link',
      tooltip: 'Role',
      icon: 'settings_applications',
      state: 'roles/lista'
    },
    {
	  modulo_id: 1,
      name: 'Permissões',
      type: 'link',
      tooltip: 'Permission',
      icon: 'settings',
      state: 'permissions/lista'
    },
    {
	  modulo_id: 1,
      name: 'Usuários',
      type: 'link',
      tooltip: 'Usuarios',
      icon: 'person_add',
      state: 'usuarios/lista'
    },
    {
	  modulo_id: 1,
      name: 'Clientes',
      type: 'link',
      tooltip: 'Clientes',
      icon: 'group_work',
      state: 'clientes/lista'
    },
    {
	  modulo_id: 1,
      name: 'Associados',
      type: 'link',
      tooltip: 'Associados',
      icon: 'person',
      state: 'associados/lista'
    },
    {
	  modulo_id: 1,
      name: 'Dependentes',
      type: 'link',
      tooltip: 'Dependentes',
      icon: 'group',
      state: 'dependentes/lista'
    },
    {
   	  modulo_id: 1,
      name: 'Agendamentos',
      type: 'link',
      tooltip: 'Agendamentos',
      icon: 'date_range',
      state: 'agendamentos/lista'
    }
  ]
   */
  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle: string = 'Frequently Accessed';
  // sets iconMenu as default;
  menuItems 				= new BehaviorSubject<IMenuItem[]>(this.iconMenu);
  // navigation component has subscribed to this Observable
  menuItems$ 				= this.menuItems.asObservable();

  // Customizer component uses this method to change menu.
  // You can remove this method and customizer component.
  // Or you can customize this method to supply different menu for
  // different user type.
  publishNavigationChange(menuType: string) {
    this.menuItems.next(this.iconMenu);
	//this.menuItems.next(this.iconMenu);
  }
}