import { Route, RouterModule } from "@angular/router";
import { AddFeatureComponent } from "./add-feature/add-feature.component";
import { NgModule } from "@angular/core";
import { AdminComponent } from "./admin.component";
import { UpdateFeatureComponent } from "./update-feature/update-feature.component";

export const routes: Route[] = [
    {
        path: '',
        component: AdminComponent,
        children: [
          {
            path: '',
            redirectTo: 'add',
            pathMatch: 'full'
          },
          {
            path: 'add',
            component: AddFeatureComponent
          },
          {
            path: 'update',
            component: UpdateFeatureComponent
          }
        ]
      }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {}