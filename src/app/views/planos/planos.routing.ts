import { Routes } from "@angular/router";
import { PlanosComponent } from "../planos/planos.component";

export const PlanosRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: PlanosComponent,
        data: { title: "Planos", breadcrumb: "Planos" }
      }
    ]
  }
];
