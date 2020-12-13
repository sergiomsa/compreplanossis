import { Routes } from "@angular/router";
import { AbrangenciasComponent } from "../abrangencias/abrangencias.component";

export const AbrangenciasRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: AbrangenciasComponent,
        data: { title: "Abrangencias", breadcrumb: "Abrangencias" }
      }
    ]
  }
];
