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
import { ReceiptsComponent } from './receipts/receipts.component';
import { VehiclesComponent} from './vehicles/vehicles.component';
import { AddUnitComponent} from '../app/add-unit/add-unit.component';
import { LoginComponent} from '../app/login/login.component';
import { FamilyMembersComponent} from '../app/family-members/family-members.component'
import { RegisterComponent} from '../app/register/register.component'
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { StaffComponent } from './staff/staff.component';
import { ReportsComponent } from './reports/reports.component';
import { VisitorsComponent } from './visitors/visitors.component';
import { PatrollingComponent } from './patrolling/patrolling.component';
import { SupplierStatementComponent } from './supplier-statement/supplier-statement.component';
import { CustomerStatementComponent } from './customer-statement/customer-statement.component';
import { GeneralLedgerComponent } from './general-ledger/general-ledger.component';
import { ProfitlossComponent } from './profitloss/profitloss.component';
import { BalancesheetComponent } from './balancesheet/balancesheet.component';
import { JournelsComponent } from './journels/journels.component';
import { SubscriptionManagementComponent } from './subscription-management/subscription-management.component';
import { from } from 'rxjs';



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
    { path: 'receipts', component:ReceiptsComponent},
    { path: 'units', component:UnitsComponent},
    { path: 'vehicles', component:VehiclesComponent},
    { path: 'addunit', component:AddUnitComponent},
    { path: 'login', component:LoginComponent},
    { path: 'register', component:RegisterComponent},
    { path: 'family', component:FamilyMembersComponent},
    { path: 'visitors', component:VisitorsComponent},
    { path: 'staffs', component:StaffComponent},
    { path: 'deliveries', component:DeliveriesComponent},
    { path: 'reports', component:ReportsComponent},
    { path: 'customer', component:CustomerStatementComponent},
    { path: 'supplier', component:SupplierStatementComponent},
    { path: 'patrol', component:PatrollingComponent},
    { path: 'generalLedger', component:GeneralLedgerComponent},
    { path: 'profitloss', component:ProfitlossComponent},
    { path: 'balancesheet', component:BalancesheetComponent},
    { path: 'journel', component:JournelsComponent},
    { path: 'subscription', component:SubscriptionManagementComponent},

]
@NgModule({
    imports:[RouterModule.forRoot(routes,{scrollPositionRestoration:'enabled'})],
    exports:[RouterModule]
    })
export class Routing {
}
