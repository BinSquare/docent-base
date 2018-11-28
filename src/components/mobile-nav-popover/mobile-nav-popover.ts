import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, ViewController} from 'ionic-angular'
import { AuthService } from "../../services/auth.service";

import { HomePage } from '../../pages/home/home';
import { ReviewPage } from '../../pages/review/review';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { NavigatePage } from '../../pages/navigate/navigate';
import { NotapplicablePage } from '../../pages/notapplicable/notapplicable';
import { SkippedquestionsPage } from '../../pages/skippedquestions/skippedquestions';
import { ActionitemsPage } from '../../pages/actionitems/actionitems';
import { QuestionsPage } from "../../pages/questions/questions";
import { UserDashboardPage } from "../../pages/user-dashboard/user-dashboard";
import { DefinitionsPage } from '../../pages/definitions/definitions';
import { FaqsPage } from '../../pages/faqs/faqs';
import { CriteriaPage } from '../../pages/criteria/criteria';
import { SettingsPage } from '../../pages/settings/settings';
import { AcronymsPage} from '../../pages/acronyms/acronyms';



/**
 * Generated class for the MobileNavPopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'mobile-nav-popover',
  templateUrl: 'mobile-nav-popover.html'
})
export class MobileNavPopoverComponent {

  text: string;
  regularNavShow: boolean = true;
  helpShow: boolean = false;
  assessmentId: any;
  assessmentShow: boolean = false;
  userName: any;


  constructor(public navCtrl: NavController,
                    public navParams: NavParams,
                    public viewCtrl: ViewController,
                    public auth: AuthService) {
    this.assessmentId = navParams.data.assessmentId;
    this.userName = navParams.data.userName;
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

  handleUserDash = () => this.navCtrl.push(UserDashboardPage, {assessmentId: this.assessmentId});
  handleContinue = () => this.navCtrl.push(QuestionsPage, {assessmentId: this.assessmentId});
  handleStartNew = () => this.navCtrl.push(HomePage);
  handleDashboard = () => this.navCtrl.push(DashboardPage, {assessmentId: this.assessmentId});
  handleNavigate = () => this.navCtrl.push(NavigatePage, {assessmentId: this.assessmentId});
  handleReview = () => this.navCtrl.push(ReviewPage, {assessmentId: this.assessmentId});
  handleActionItems = () => this.navCtrl.push(ActionitemsPage, {assessmentId: this.assessmentId});
  handleSkipped = () => this.navCtrl.push(SkippedquestionsPage, {assessmentId: this.assessmentId});
  handleNA = () => this.navCtrl.push(NotapplicablePage, {assessmentId: this.assessmentId});
  handleCriteria = () => this.navCtrl.push(CriteriaPage, {assessmentId: this.assessmentId});
  handleDefinitions = () => this.navCtrl.push(DefinitionsPage, {assessmentId: this.assessmentId});
  handleFaqs = () => this.navCtrl.push(FaqsPage, {assessmentId: this.assessmentId});
  handleAcronyms = () => this.navCtrl.push(AcronymsPage, {assessmentId: this.assessmentId});
  handleSettings = () => this.navCtrl.push(SettingsPage, {assessmentId: this.assessmentId});
  // handleAcronyms = () => this.navCtrl.push(AcronymsPage, {assessmentId: this.assessmentId});

}
