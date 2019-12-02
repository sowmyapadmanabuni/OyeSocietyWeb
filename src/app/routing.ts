import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import{ HomeComponent } from './home/home.component';
import { HiringComponent } from './hiring/hiring.component';
import { MapsComponent } from './maps/maps.component';
import { ClientsComponent } from './clients/clients.component';
import { AboutComponent } from './about/about.component'; 
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { LocationComponent } from './location/location.component';
import { BlogsComponent } from './blogs/blogs.component';
import { JobsComponent } from './jobs/jobs.component';
import { GooglemapComponent } from './googlemap/googlemap.component';
import { AssociationManagementComponent } from './association-management/association-management.component';
import { ExpenseManagementComponent } from './expense-management/expense-management.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { BlocksComponent } from './blocks/blocks.component';
import { UnitsComponent } from './units/units.component';

const routes: Routes = [
    { path: '',redirectTo:'home', pathMatch: 'full'},
    { path: 'home', component: HomeComponent },
    { path: 'hiring', component: HiringComponent },
    { path: 'maps', component:MapsComponent},
    { path: 'clients', component:ClientsComponent},
    { path: 'location', component:LocationComponent},
    { path: 'about', component:AboutComponent},
    { path: 'testimonials', component:TestimonialsComponent},
    { path: 'blogs', component:BlogsComponent},
    { path: 'jobs', component:JobsComponent},
    { path: 'googlemaps', component:GooglemapComponent},
    { path: 'association', component:AssociationManagementComponent},
    { path: 'expense', component:ExpenseManagementComponent},
    { path: 'blocks', component:BlocksComponent},
    { path: 'invoice', component:InvoicesComponent},
    { path: 'units', component:UnitsComponent}
]
@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
    })
export class Routing {
}
