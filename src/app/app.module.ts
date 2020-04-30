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
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
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
import {ReceiptsComponent} from './receipts/receipts.component';
import {Ng2TelInputModule} from 'ng2-tel-input';
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
import { ChartsModule } from 'ng2-charts';
import { ExcelBlockUploadComponent } from './excel-block-upload/excel-block-upload.component';
import { ExcelUnitUploadComponent } from './excel-unit-upload/excel-unit-upload.component';
import { ExcelExpenseUploadComponent } from './excel-expense-upload/excel-expense-upload.component';
import { BlockArrayComponent } from './block-array/block-array.component';
import { CreateUnitWithAssociationComponent } from './create-unit-with-association/create-unit-with-association.component';
import { JoinAndEnrollComponent } from './join-and-enroll/join-and-enroll.component';
import { EditAssociationComponent } from './edit-association/edit-association.component';
import { ExcelReceiptUploadComponent } from './excel-receipt-upload/excel-receipt-upload.component';
import { PartnersComponent } from './partners/partners.component';
import { LocationsComponent } from './locations/locations.component';
import {AboutusComponent} from './aboutus/aboutus.component'
import {AccountingComponent} from './accounting/accounting.component'
import {SafetyComponent} from './safety/safety.component';
import { UserIdleModule } from 'angular-user-idle';
import { AudioRecordingService } from './audio-recording.service';
import {BroadcastComponent } from './broadcast/broadcast.component';

 
import { from } from 'rxjs';
import { ErrorComponent } from './error/error.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
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
    AboutusComponent,
    LocationsComponent,
    PartnersComponent,
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
    MembersComponent,
    ExcelBlockUploadComponent,
    ExcelUnitUploadComponent,
    ExcelExpenseUploadComponent,
    BlockArrayComponent,
    CreateUnitWithAssociationComponent,
    JoinAndEnrollComponent,
    EditAssociationComponent,
    ExcelReceiptUploadComponent,
    AccountingComponent,
    SafetyComponent,
    ErrorComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    BroadcastComponent
    ],
  imports: [
    ReactiveFormsModule,
    Ng2TelInputModule,
    BrowserModule,
    ChartsModule,
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
    UserIdleModule.forRoot({idle:1800, timeout:60, ping:30}), //600=10minute
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
  providers: [AudioRecordingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
