import { Route, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AdminComponent } from "./admin.component";
import { AdminFeatureComponent } from "./admin-feature/admin-feature.component";
import { ContactRequestsComponent } from "./contact-requests/contact-requests.component";
import { QuoteRequestsComponent } from "./quote-requests/quote-requests.component";

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
            path: 'contact-requests', 
            component: ContactRequestsComponent
          },
          {
            path: 'quote-requests', 
            component: QuoteRequestsComponent
          }
        ]
      }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {}