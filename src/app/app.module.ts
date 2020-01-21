import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { Routing } from './routing';
import { RequestformComponent } from './requestform/requestform.component';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { HiringComponent } from './hiring/hiring.component';
import { MapsComponent } from './maps/maps.component';
import { AgmCoreModule } from '@agm/core';
import { JwPaginationComponent } from 'jw-angular-pagination';
import { OrderModule } from 'ngx-order-pipe';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { ClientsComponent } from './clients/clients.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { LocationComponent } from './location/location.component';
import { AboutComponent } from './about/about.component';
import { BlogsComponent } from './blogs/blogs.component';
import { FooterComponent } from './footer/footer.component';
import { JobsComponent } from './jobs/jobs.component';
import { GooglemapComponent } from './googlemap/googlemap.component';
import { AgmDirectionModule } from 'agm-direction';
import { AssociationManagementComponent } from './association-management/association-management.component';
import { ExpenseManagementComponent } from './expense-management/expense-management.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { BlocksComponent } from './blocks/blocks.component';
import {LoginComponent} from './login/login.component'
import {RegisterComponent} from './register/register.component'
import {VehiclesComponent} from './vehicles/vehicles.component'
import {FamilyMembersComponent} from './family-members/family-members.component'
import { UnitsComponent } from './units/units.component';
import { LeftBarComponent } from './left-bar/left-bar.component';
import { RightBarComponent } from './right-bar/right-bar.component';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataTablesModule } from 'angular-datatables';
import { DataTableModule } from "angular-6-datatable";
import { SearchPipe } from './search.pipe';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {ReceiptsComponent} from './receipts/receipts.component'
import { ToastrModule } from 'ngx-toastr';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { WordsPipe } from './pipes/words.pipe';
import {AddUnitComponent} from './add-unit/add-unit.component'
import { NewAmenityComponent } from './new-amenity/new-amenity.component';
import {AddBlocksComponent} from './add-blocks/add-blocks.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { VisitorsComponent } from './visitors/visitors.component';
import { StaffComponent } from './staff/staff.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { SubscriptionManagementComponent } from './subscription-management/subscription-management.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { ReportsComponent } from './reports/reports.component';
import { PatrollingComponent } from './patrolling/patrolling.component';
import { CustomerStatementComponent } from './customer-statement/customer-statement.component';
import { SupplierStatementComponent } from './supplier-statement/supplier-statement.component';
import { GeneralLedgerComponent } from './general-ledger/general-ledger.component';
import { ProfitlossComponent } from './profitloss/profitloss.component';
import { BalancesheetComponent } from './balancesheet/balancesheet.component';
import { JournelsComponent } from './journels/journels.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { ProfileComponent } from './profile/profile.component';
import { ResidentInvoiceComponent } from './resident-invoice/resident-invoice.component';
import { GenerateReceiptComponent } from './generate-receipt/generate-receipt.component';
import { AssociationVisitorComponent } from './association-visitor/association-visitor.component';
import { JwSocialButtonsModule } from 'jw-angular-social-buttons';
import { MembersComponent } from './members/members.component';
//export const firebaseConfig = environment.firebaseConfig;

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InvoicesComponent,
    RequestformComponent,
    ReceiptsComponent,
    HiringComponent,
    JwPaginationComponent,
    MapsComponent,
    ClientsComponent,
    TestimonialsComponent,
    LocationComponent,
    AboutComponent,
    BlogsComponent,
    FooterComponent,
    JobsComponent,
    GooglemapComponent,
    AssociationManagementComponent,
    ExpenseManagementComponent,
    VehiclesComponent,
    FamilyMembersComponent,
    BlocksComponent,
    LoginComponent,
    RegisterComponent,
    AddUnitComponent,
    UnitsComponent,
    LeftBarComponent,
    RightBarComponent,
    SearchPipe,
    WordsPipe,
    NewAmenityComponent,
    AddBlocksComponent,
    AddExpenseComponent,
    VisitorsComponent,
    StaffComponent,
    DeliveriesComponent,
    SubscriptionManagementComponent,
    ReportsComponent,
    PatrollingComponent,
    CustomerStatementComponent,
    SupplierStatementComponent,
    GeneralLedgerComponent,
    ProfitlossComponent,
    BalancesheetComponent,
    JournelsComponent,
    PaymentStatusComponent,
    ProfileComponent,
    ResidentInvoiceComponent,
    GenerateReceiptComponent,
    AssociationVisitorComponent,
    MembersComponent
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    OrderModule,
    FormsModule,
    Routing,
    AgmDirectionModule,
    NgxPaginationModule,
    DataTablesModule,
    //AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireMessagingModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsKey,
      libraries: ['geometry']
    }),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DataTableModule,
    ToastrModule.forRoot(),
    ProgressbarModule.forRoot(),
    NgxQRCodeModule,
    TooltipModule.forRoot(),
    JwSocialButtonsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
