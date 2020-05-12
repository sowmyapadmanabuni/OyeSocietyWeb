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
import { ProfileComponent } from './profile/profile.component';
import {PaymentStatusComponent} from './payment-status/payment-status.component';
import {ResidentInvoiceComponent} from './resident-invoice/resident-invoice.component';
import {AssociationVisitorComponent} from './association-visitor/association-visitor.component';
import {MembersComponent} from './members/members.component';
import {AppComponent} from './app.component';
import {ExcelBlockUploadComponent} from './excel-block-upload/excel-block-upload.component';
import {ExcelUnitUploadComponent} from './excel-unit-upload/excel-unit-upload.component';
import {ExcelExpenseUploadComponent} from './excel-expense-upload/excel-expense-upload.component';
import {JoinAndEnrollComponent} from './join-and-enroll/join-and-enroll.component';
import {EditAssociationComponent} from './edit-association/edit-association.component';
import {AccountingComponent} from './accounting/accounting.component'
import {SafetyComponent} from './safety/safety.component'
import {ErrorComponent} from './error/error.component'
import {TermsAndConditionsComponent} from './terms-and-conditions/terms-and-conditions.component';
import {PrivacyPolicyComponent} from './privacy-policy/privacy-policy.component';
import {BroadcastComponent } from './broadcast/broadcast.component';
import {ExcelReceiptUploadComponent} from './excel-receipt-upload/excel-receipt-upload.component';
import {AdminDeleveryScreenComponent} from './admin-delevery-screen/admin-delevery-screen.component';
import {AdminStaffScreenComponent} from './admin-staff-screen/admin-staff-screen.component';
import { CareersComponent } from './careers/careers.component';


const routes: Routes = [
    { path: '',redirectTo:'home', pathMatch: 'full'},
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'hiring', component: HiringComponent, canActivate: [AuthGuard] },
    { path: 'maps', component:MapsComponent, canActivate: [AuthGuard]},
    { path: 'clients', component:ClientsComponent, canActivate: [AuthGuard]},
    { path: 'location', component:LocationComponent, canActivate: [AuthGuard]},
    { path: 'members', component:MembersComponent, canActivate: [AuthGuard]},
    { path: 'accounting', component:AccountingComponent, canActivate: [AuthGuard]},
    { path: 'safety', component:SafetyComponent, canActivate: [AuthGuard]},
    { path: 'excelblock', component:ExcelBlockUploadComponent, canActivate: [AuthGuard]},
    { path: 'excelunit', component:ExcelUnitUploadComponent, canActivate: [AuthGuard]},
    { path: 'excelexpense', component:ExcelExpenseUploadComponent, canActivate: [AuthGuard]},
    { path: 'about', component:AboutComponent, canActivate: [AuthGuard]},
    { path: 'testimonials', component:TestimonialsComponent, canActivate: [AuthGuard]},
    { path: 'blogs', component:BlogsComponent, canActivate: [AuthGuard]},
    { path: 'jobs', component:JobsComponent, canActivate: [AuthGuard]},
    { path: 'careers', component:CareersComponent, canActivate: [AuthGuard]},
    { path: 'googlemaps', component:GooglemapComponent, canActivate: [AuthGuard]},
    { path: 'association', component:AssociationManagementComponent, canActivate: [AuthGuard],canDeactivate:[AuthGuard]},
    { path: 'expense', component:ExpenseManagementComponent, canActivate: [AuthGuard]},
    { path: 'blocks', component:BlocksComponent, canActivate: [AuthGuard]},
    { path: 'invoice', component:InvoicesComponent, canActivate: [AuthGuard]},
    { path: 'invoice/:mrmroleId', component:InvoicesComponent, canActivate: [AuthGuard]},
    { path: 'receipts', component:ReceiptsComponent, canActivate: [AuthGuard]},
    { path: 'receipts/:mrmroleId', component:ReceiptsComponent, canActivate: [AuthGuard]},
    { path: 'units', component:UnitsComponent, canActivate: [AuthGuard]},
    { path: 'vehicles', component:VehiclesComponent, canActivate: [AuthGuard]},
    { path: 'addunit', component:AddUnitComponent, canActivate: [AuthGuard]},
    { path: 'login', component:LoginComponent, canActivate: [AuthGuard]},
    { path: 'register', component:RegisterComponent, canActivate: [AuthGuard]},
    { path: 'family', component:FamilyMembersComponent, canActivate: [AuthGuard]},
    { path: 'visitors', component:VisitorsComponent, canActivate: [AuthGuard]},
    { path: 'AssocitionVisitors', component:AssociationVisitorComponent, canActivate: [AuthGuard]},
    { path: 'staffs', component:StaffComponent, canActivate: [AuthGuard]},
    { path: 'error', component:ErrorComponent, canActivate: [AuthGuard]},
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
    { path: 'journel', component:JournelsComponent, canActivate: [AuthGuard]},
    { path: 'profile', component:ProfileComponent, canActivate: [AuthGuard]},
    { path: 'payment-status', component:PaymentStatusComponent, canActivate: [AuthGuard]},
    { path: 'resident-invoice', component:ResidentInvoiceComponent, canActivate: [AuthGuard]},
    { path: 'root', component:AppComponent, canActivate: [AuthGuard]},
    { path: 'excelreceipt', component:ExcelReceiptUploadComponent, canActivate: [AuthGuard]},
    { path: 'joinenroll', component:JoinAndEnrollComponent, canActivate: [AuthGuard]},
    { path: 'joinenroll/:join_enroll', component:JoinAndEnrollComponent, canActivate: [AuthGuard]},
    { path: 'editassociation', component:EditAssociationComponent, canActivate: [AuthGuard]},
    { path: 'termsandcondition', component:TermsAndConditionsComponent},
    { path: 'privacypolicy', component:PrivacyPolicyComponent},
    { path: 'broadcast', component:BroadcastComponent},
    { path: 'editassociation', component:EditAssociationComponent, canActivate: [AuthGuard]},
    { path: 'admindeleveryscreen', component:AdminDeleveryScreenComponent, canActivate: [AuthGuard]},
    { path: 'adminstaffscreen', component:AdminStaffScreenComponent, canActivate: [AuthGuard]}
]
@NgModule({
    imports:[RouterModule.forRoot(routes,{scrollPositionRestoration:'enabled'})],
    exports:[RouterModule]
    })
export class Routing {
}
