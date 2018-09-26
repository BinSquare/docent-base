import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from "../../services/auth.service";
import { TopbarComponent } from "../../components/topbar/topbar";
import { SettingsPage } from "../settings/settings";
import { QuestionsPage } from "../questions/questions";
import { DashboardPage } from "../dashboard/dashboard";
import { ActionitemsPage } from "../actionitems/actionitems";

import { HomePage } from "../home/home";
import {Subscription} from "rxjs";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import * as $ from 'jquery'

import { AuthUrl } from "../../services/constants";

var assessmentQuery = gql`
query assessments($userId: String) {
	assessments(userId: $userId) {
	   scope
     targetMRL
     targetDate
     levelSwitching
     deskbookVersion
     location
     name
     id
	}
}
`

var sharedQuery = gql`
query getShared($assessments: [String]) {
	getShared(assessments: $assessments) {
		scope
		targetMRL
    targetDate
    levelSwitching
    deskbookVersion
    location
    name
	}
}
`

@IonicPage()
@Component({
  selector: 'page-user-dashboard',
  templateUrl: 'user-dashboard.html',
})
export class UserDashboardPage {



  public fakeUser: any = {
    name: "Jane Doe",
    email: "janedoe@docent.co",
    organization: "Docent",
    id: "test_dash"
  };
  assessments: any;
	sharedAssessments: any = [];
  loading: boolean;
  private querySubscription: Subscription;
	private sharedAssessmentIds = [];
	expand: any = false;
  currentAssessment: any = null;
	noSecondBar: boolean = false;
	assessmentId: any;


  constructor(public navCtrl: NavController,
                    public navParams: NavParams,
										private apollo: Apollo,
										private auth: AuthService) {
                      this.assessmentId = navParams.data.assessmentId;

                    }

  async ngOnInit() {

		await this.getSharedAssessments();
		this.pullSharedAssessments();


    var userId = this.fakeUser.id;
    this.querySubscription = this.apollo.watchQuery<any>({
      query: assessmentQuery,
      variables: {
        userId: "dev"
      }
    })
    .valueChanges
    .subscribe(({data, loading}) => {
      this.loading = loading;
      this.assessments = data.assessments;
      console.log("doing anything in here?");
      console.log(data.assessments);
    });
  }



	async getSharedAssessments() {
		var user;
		if (this.auth.currentUser()) {
		 user = this.auth.currentUser();
			await fetch(AuthUrl + "shared", {
			method: "POST",
			body: JSON.stringify({email: user.email}),
			headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
			},
		})
			.then(a => a.json())
			.then(a => this.sharedAssessmentIds = a )
			.catch(e => console.log(e));
		}
	}

	pullSharedAssessments() {
		console.log(this.sharedAssessmentIds);
		this.apollo.watchQuery<any>({
      query: sharedQuery,
      variables: {
        assessments: this.sharedAssessmentIds
      }
    })
    .valueChanges
    .subscribe(({data, loading}) => {
			this.sharedAssessments = data.getShared;
    });


	}

  expandAssessment(assessmentId) {
    console.log(assessmentId);
    // this.expand = !this.expand;
    if (this.currentAssessment == assessmentId) {
      this.currentAssessment = null;
    } else {
      this.currentAssessment = assessmentId;
    }

  }


  continueAssessment(assessmentId){ this.navCtrl.push(QuestionsPage, {assessmentId: assessmentId});}
  openDashboard(assessmentId){this.navCtrl.push(DashboardPage, {assessmentId: assessmentId});}
  openActionItems(assessmentId){this.navCtrl.push(ActionitemsPage, {assessmentId: assessmentId});}
	redirectToCreate(){	this.navCtrl.push(HomePage);	}
  handleSettings(){ this.navCtrl.push(SettingsPage);}

	handleDeleting(assessmentId){
		console.log("time to delete")
	}

}
