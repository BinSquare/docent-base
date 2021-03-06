import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { ViewsComponent } from '../../components/views/views';
import { TopbarComponent } from "../../components/topbar/topbar";
import { AssessmentService } from '../../services/assessment.service';
import { GoogleAnalytics } from '../../application/helpers/GoogleAnalytics';
import { ActionitemsPage } from '../actionitems/actionitems';
import { NotapplicablePage } from '../notapplicable/notapplicable';
import { SkippedquestionsPage } from '../skippedquestions/skippedquestions';
import { LegendPopoverComponent } from '../../components/legend-popover/legend-popover';


import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

var assessmentQuery = gql`
query assessment($_id: String) {
	assessment(_id: $_id) {
	questions {
		mrLevel
		threadName
		questionText
		subThreadName
		currentAnswer
    answers {
      answer
    }
	}
	}
}
`

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

	allQuestions: any;
	assessmentId: any;
  questionSet: any;
	showAll: any;
	pageName: any = "Dashboard";

	constructor( private apollo: Apollo,
							 public navCtrl: NavController,
							 public navParams: NavParams,
							 public popOver: PopoverController,
               private assessmentService: AssessmentService) {}

  // helper function to pull unique values from array.
	unique = (item, index, array) => array.indexOf(item) == index

	ionViewWillEnter() {
    GoogleAnalytics.trackPage("dashboard");
  }

	async ngOnInit() {
		this.assessmentId = await this.assessmentService.getCurrentAssessmentId();

		this.apollo.watchQuery({
			query: assessmentQuery,
			variables: {_id: this.assessmentId},
			fetchPolicy: "network-only"
			}).valueChanges
			.subscribe(data => {
					this.allQuestions = (<any>data.data).assessment.questions;
					this.questionSet  = this.createQuestionSet(this.allQuestions);
          this.questionSet.unshift({questions: [{subheader: 'MR Levels', answers: [1,2,3,4,5,6,7,8,9,10]}]});
          //					this.questionSet = this.dearGod();
			});
	}

  isHeader(response) { return typeof response == 'number'; }

	dearGod() {
		return this.questionSet.map(a => {
			a.questions.map(b => {
				b.answers.map(c => {
						if ( c == true ) {
							var index = b.answers.indexOf(c);
							for (let i = 0; i < index; i += 1) {
								b.answers[i] = true
							}
						}
				})
				return b;
			})
		return a
		});
	}

	filterUnique = (array, property=null) => property ? this.filterByProperty(array, property) : this.filterByValue(array)

	filterByValue(array) {
		return Array.from(new Set(array));
	}

	filterByProperty(array, itemProperty) {
		return Array.from(new Set(array.map(item => item[itemProperty])));
	}

	createQuestionSet(questionsArray) {
	var threadNames = questionsArray.map(a => a.threadName)
					  											 .filter(this.unique);

	var subThreadNames = threadNames.map( a => {
		var allSubheaders = questionsArray.filter(b => b.threadName == a)
		var subThreadNames = this.filterUnique(allSubheaders, "subThreadName")
				.map(sName => {
					var questions = questionsArray.filter(m => m.subThreadName == sName);
					var mrLevels = [1,2,3,4,5,6,7,8,9,10]
					var a = mrLevels.map(f => {
					  // default is null/gray
						var sectionValue = null;
						var questionSet = questions.filter(s => s.mrLevel == f)
						// if there are no questions, the section is marked as blank
						if (questionSet.length == 0) { sectionValue = "blank";}

            if ( questionSet.length > 0 && questionSet.every(obj => obj.answers.length > 0 && obj.answers[obj.answers.length - 1].answer == 'Yes') )  { 
            sectionValue = true;}
						// if every answer is yes, complete the section
            if (questionSet.length > 0 && questionSet.every(a => { a.answers.length > 0 && a.answers[a.answers.length - 1 ].answer == "Yes" }) ) {
						sectionValue = true
						}
						questionSet.forEach(a => {
						  // if any answer is no, fail the section.
              if (a.answers.length > 0 && a.answers[a.answers.length - 1].answer == "No") sectionValue = false
						})
							 return sectionValue;
					})
				return { subheader: sName, answers: a };
				});


		return {header: a, questions: subThreadNames};
	})
		return subThreadNames
	}


  presentViewsPop(event){
    let popover = this.popOver.create(ViewsComponent);
    popover.present({
      ev: event
    });
  }

	presentLegend(event){
		let popover = this.popOver.create(LegendPopoverComponent, {cssClass: 'legendpop'});
		popover.present({
			ev: event
		});
	}

	toggleSubThread(thread){
		thread.show = !thread.show;
	}

	expandAll(){
		this.showAll = !this.showAll;
	}

	handleActionItems = () => this.navCtrl.push(ActionitemsPage, {assessmentId: this.assessmentId});
	handleNa = () => this.navCtrl.push(NotapplicablePage, {assessmentId: this.assessmentId});
	handleSkipped = () => this.navCtrl.push(SkippedquestionsPage, {assessmentId: this.assessmentId});
}

