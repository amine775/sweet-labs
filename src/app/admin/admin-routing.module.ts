import { Route, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AdminComponent } from "./admin.component";
import { AdminFeatureComponent } from "./admin-feature/admin-feature.component";
import { UsersRequestsComponent } from "./users-requests/users-requests.component";

export const routes: Route[] = [
    {
        path: '',
        component: AdminComponent,
        children: [
          {
            path: '',
            redirectTo: 'admin-features',
            pathMatch: 'full'
          },
          {
            path: 'admin-features',
            component: AdminFeatureComponent
          }, 
          {
            path: 'users-requests', 
            component: UsersRequestsComponent
          }
        ]
      }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {}