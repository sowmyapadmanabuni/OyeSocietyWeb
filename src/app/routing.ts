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
import { AuthGuard } from './guards/auth.guard';
import { from } from 'rxjs';



const routes: Routes = [
    { path: '',redirectTo:'home', pathMatch: 'full'},
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'hiring', component: HiringComponent, canActivate: [AuthGuard] },
    { path: 'maps', component:MapsComponent, canActivate: [AuthGuard]},
    { path: 'clients', component:ClientsComponent, canActivate: [AuthGuard]},
    { path: 'location', component:LocationComponent, canActivate: [AuthGuard]},
    { path: 'about', component:AboutComponent, canActivate: [AuthGuard]},
    { path: 'testimonials', component:TestimonialsComponent, canActivate: [AuthGuard]},
    { path: 'blogs', component:BlogsComponent, canActivate: [AuthGuard]},
    { path: 'jobs', component:JobsComponent, canActivate: [AuthGuard]},
    { path: 'googlemaps', component:GooglemapComponent, canActivate: [AuthGuard]},
    { path: 'association', component:AssociationManagementComponent, canActivate: [AuthGuard]},
    { path: 'expense', component:ExpenseManagementComponent, canActivate: [AuthGuard]},
    { path: 'blocks', component:BlocksComponent, canActivate: [AuthGuard]},
    { path: 'invoice', component:InvoicesComponent, canActivate: [AuthGuard]},
    { path: 'receipts', component:ReceiptsComponent, canActivate: [AuthGuard]},
    { path: 'units', component:UnitsComponent, canActivate: [AuthGuard]},
    { path: 'vehicles', component:VehiclesComponent, canActivate: [AuthGuard]},
    { path: 'addunit', component:AddUnitComponent, canActivate: [AuthGuard]},
    { path: 'login', component:LoginComponent, canActivate: [AuthGuard]},
    { path: 'register', component:RegisterComponent, canActivate: [AuthGuard]},
    { path: 'family', component:FamilyMembersComponent, canActivate: [AuthGuard]},
    { path: 'visitors', component:VisitorsComponent, canActivate: [AuthGuard]},
    { path: 'staffs', component:StaffComponent, canActivate: [AuthGuard]},
    { path: 'deliveries', component:DeliveriesComponent, canActivate: [AuthGuard]},
    { path: 'reports', component:ReportsComponent, canActivate: [AuthGuard]},
    { path: 'patroling', component:PatrollingComponent, canActivate: [AuthGuard]},
    { path: 'subscription', component:SubscriptionManagementComponent, canActivate: [AuthGuard]},
    { path: 'customer', component:CustomerStatementComponent, canActivate: [AuthGuard]},
    { path: 'supplier', component:SupplierStatementComponent, canActivate: [AuthGuard]},
    { path: 'patrol', component:PatrollingComponent, canActivate: [AuthGuard]},
    { path: 'generalLedger', component:GeneralLedgerComponent, canActivate: [AuthGuard]},
    { path: 'profitloss', component:ProfitlossComponent, canActivate: [AuthGuard]},
    { path: 'balancesheet', component:BalancesheetComponent, canActivate: [AuthGuard]},
    { path: 'journel', component:JournelsComponent, canActivate: [AuthGuard]}
]
@NgModule({
    imports:[RouterModule.forRoot(routes,{scrollPositionRestoration:'enabled'})],
    exports:[RouterModule]
    })
export class Routing {
}
