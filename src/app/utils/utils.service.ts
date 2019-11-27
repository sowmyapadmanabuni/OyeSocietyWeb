import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  ipAddress: string;
  url: string;

  constructor(private http: HttpClient) {
    this.ipAddress = 'http://apiuat.oyespace.com/';
   }

  createBlock(){
    return this.ipAddress;
  }

  getIPaddress(){
    return this.ipAddress;
  }

  createUnit(){
    return this.ipAddress;
  }
  GetBlockListByAssocID() {
    return this.ipAddress;
  }
  GetPurchaseOrderListByAssocID(){
    return this.ipAddress;
  }
  getAssociationList() {
    return this.ipAddress;
  }
  prerequisitesAddUnit(){
    return this.ipAddress;
  }
  GetUnitListByBlockID() {
    return this.ipAddress;
  }
  createExpense(){
    return this.ipAddress;
  }
  getAssociationDetailsByAssociationid(){
    return this.ipAddress;
  }
  getAssociation() {
    return this.ipAddress;
  }
  loadAssociationforchangerole() {
    return this.ipAddress;
  }
  loadUnitForAssociation() {
    return this.ipAddress;
  }
  addfamilymember() {
    return this.ipAddress;
  }
  getAmount(){
    return this.ipAddress;
  }
  getMembers(){
    return this.ipAddress;
  }
  getTickets(){
    return this.ipAddress;
  }
  getAccountFirstName(){
    return this.ipAddress;
  }
  getVehicle(){
    return this.ipAddress;
  }
  getStaff(){
    return this.ipAddress;
  }
  getVisitors(){
    return this.ipAddress;
  }
  getProfileDetails(){
    return this.ipAddress;
  }
  updateEditProfile() {
    return this.ipAddress;
  }
  getCurrentBlockDetails(){
    return this.ipAddress;
  }
  addPayment(){
    return this.ipAddress;
  }
  sendOTP() {
    return this.ipAddress;
  }
  verifyOtp() {
    return this.ipAddress;
  }
  resendOtp() {
    return this.ipAddress;
  }
  GetUnitListByUnitID() {
    return this.ipAddress;
  }
  invoiceDetails(){
    return this.ipAddress;
  }
  getassociationlist() {
    return this.ipAddress;
  }
  UpdateInvoiceDiscountValueAndInsert() {
    return this.ipAddress;
  }
  register(){
    return this.ipAddress;
  }
  getAssociationAllDetails(){
    return this.ipAddress;
  }
  UpdateAssociation() {
    return this.ipAddress;
  }
  getAssociationDetail(){
    return this.ipAddress;
  }
  createAssn(){
    return this.ipAddress;
  }
  GetAccountListByAccountID(){
    return this.ipAddress;
  }
  getBlockDetails(){
    return this.ipAddress;
  }
  getVehileDetailsByIPaddress(){
    return this.ipAddress;
  }
  UpdateBlock(){
    return this.ipAddress;
  }
  GetExpenseListByAssocID(){
    return this.ipAddress;
  }
  GetExpenseListByBlockID(){
    return this.ipAddress;
  }
  deleteExpense() {
    return this.ipAddress;
  }
  generateInvoice() {
    return this.ipAddress;
  }
  updateExpense() {
    return this.ipAddress;
  }
  viewInvoice() {
    return this.ipAddress;
  }
  GetAmountBalance() {
    return this.ipAddress;
  }
  GetInvoiceOwnerListByInvoiceId() {
    return this.ipAddress;
  }
  getUnitDetails(){
    return this.ipAddress;
  }
  getBlocks(){
    return this.ipAddress;
  }
  getpaymentlist(){
    return this.ipAddress;
  }
  getpaymentdetails(){
    return this.ipAddress;
  }
  updatefamilymember(){
    return this.ipAddress;
  }
  deleteFmailyMember(){
    return this.ipAddress;
  }
  getExpenseListByDatesAndID(){
    return this.ipAddress;
  }
  joinAssociation(){
    return this.ipAddress;
  }

}
