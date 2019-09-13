import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, PopoverController, ViewController} from '@ionic/angular'
import { AuthService } from "../../services/auth.service";
import {RouterModule, ActivatedRoute} from "@angular/router";
import { HomePage } from '../../pages/home/home';
import { ReviewPage } from '../../pages/review/review';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { NavigatePage } from '../../pages/navigate/navigate';
import { NotapplicablePage } from '../../pages/notapplicable/notapplicable';
import { ActionitemsPage } from '../../pages/actionitems/actionitems';
import { QuestionsPage } from "../../pages/questions/questions";
import { UserDashboardPage } from "../../pages/user-dashboard/user-dashboard";
import { DefinitionsPage } from '../../pages/definitions/definitions';
import { FaqsPage } from '../../pages/faqs/faqs';
import { CriteriaPage } from '../../pages/criteria/criteria';
import { SettingsPage } from '../../pages/settings/settings';
import { AcronymsPage } from '../../pages/acronyms/acronyms';
import { SummaryPage } from '../../pages/summary/summary';
import { RiskReportPage } from '../../pages/risk-report/risk-report';

@Component({
  selector: 'mobile-nav-popover',
  templateUrl: './mobile-nav-popover.component.html',
  styleUrls: ['./mobile-nav-popover.component.scss'],
})
export class MobileNavPopoverComponent implements OnInit {
  //vars
  text: string;
  regularNavShow: boolean = true;
  helpShow: boolean = false;
  assessmentId: any;
  assessmentShow: boolean = false;
  userName: any;
  noSecondBar: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public auth: AuthService,
    public router: RouterModule
    // private activatedRoute: RouterModule
  ) {
    this.assessmentId = navParams.data.assessmentId;
    this.userName = navParams.data.userName;
    if (navParams.data.noSecondBar){
      this.noSecondBar = navParams.data.noSecondBar;
    }

    console.log(this.noSecondBar);
    console.log(this.assessmentId);
    console.log(this.userName);
   }

   goBack(){
     if (this.helpShow == true) { this.closeHelp(); }
     else if (this.assessmentShow == true) { this.closeAssessment();}
   }

   showHelp() {
     this.helpShow = true;
     this.regularNavShow = false;
   }

   closeHelp(){
     this.helpShow = false;
     this.regularNavShow = true;
   }

   showAssessment(){
     this.assessmentShow = true;
     console.log(this.assessmentShow)
     this.regularNavShow = false;
   }

   closeAssessment(){
     this.assessmentShow = false;
     this.regularNavShow = true;
   }

   closeNav(){
     this.viewCtrl.dismiss();
   }

   ///ROUTING FUNCTIONS
   handleLogout(){
     this.auth.logout();
     this.navCtrl.setRoot(HomePage);
     this.navCtrl.popToRoot();
   }

   handleUserDash = () => 		this.router.navigate(["/user-dashboard", {assessmentId: this.assessmentId}]);
   handleContinue = () => this.router.navigate(["/questions", {assessmentId: this.assessmentId}]);
   handleStartNew = () => this.router.navigate(["/startNew"]);
   handleDashboard = () => this.router.navigate(["/dashboard", {assessmentId: this.assessmentId}]);
   //expandAllFromQs = true & autoFilter = true vvvv
   handleNavigate = () => this.router.navigate(["/navigate", {assessmentId: this.assessmentId, expandAllFromQs: true, autoFilter: true}]);
   handleReview = () => this.router.navigate(["/review", {assessmentId: this.assessmentId}]);
   handleActionItems = () => this.router.navigate(["/action-items", {assessmentId: this.assessmentId}]);
   // handleNA = () => this.navCtrl.push(NotapplicablePage, {assessmentId: this.assessmentId});
   handleCriteria = () => this.router.navigate(["/critieria", {assessmentId: this.assessmentId}]);
   handleDefinitions = () => this.router.navigate(["/definitions", {assessmentId: this.assessmentId}]);
   handleFaqs = () => this.router.navigate(["/faqs", {assessmentId: this.assessmentId}]);
   handleSettings = () => this.router.navigate(["/settings", {assessmentId: this.assessmentId}]);
   handleSummary = () => this.router.navigate(["/summary", {assessmentId: this.assessmentId}]);
   handleAcronyms = () => this.router.navigate(["/acronyms", {assessmentId: this.assessmentId}]);
   goToDoD = () => window.location.href = "http://dodmrl.com";
   goToDeskbook = () => window.location.href = "http://www.dodmrl.com/MRL_Deskbook_2017.pdf"
   handleRiskReport = () => this.router.navigate(["/risk-report", {assessmentId: this.assessmentId}]);
   // handleAcronyms = () => this.navCtrl.push(AcronymsPage, {assessmentId: this.assessmentId});


}
