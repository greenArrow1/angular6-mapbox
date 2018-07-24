import { Component, OnInit } from "@angular/core";
import { MatBottomSheet } from "@angular/material";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { PatrolTrackerService } from "../patroltracker/patroltracker.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GreetingsComponent } from "../greetings/greetings.component";

@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.css"]
})
export class FeedbackComponent implements OnInit {
  enableTextArea: boolean = false;
  rForm: FormGroup;
  post: any; // A property for our submitted form
  comment: string = "";
  togglerValue: any;
  titleAlert: string = "This field is required";
  isLoading:boolean = true;
  constructor(
    private patrolService: PatrolTrackerService,
    public bottomSheet: MatBottomSheet,
    public snackBar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.rForm = fb.group({
      togglerValue: [null, Validators.required],
      comment: [
        null,
        Validators.compose([
          Validators.required
          // ,
          // Validators.minLength(30),
          // Validators.maxLength(500)
        ])
      ],
      validate: ""
    });
  }

  ngOnInit() {
    window.location.href = 'https://staging.racv.com.au/cb-test/track-my-patrol.appview.html';
    this.isLoading = false;
    /* this.rForm.get("validate").valueChanges.subscribe(validate => {
      if (validate == "1") {
        this.rForm
          .get("name")
          .setValidators([Validators.required, Validators.minLength(3)]);
        this.titleAlert = "You need to specify at least 3 characters";
      } else {
        this.rForm.get("name").setValidators(Validators.required);
      }
      this.rForm.get("name").updateValueAndValidity();
    }); */
  }
  /**
   * toggle textarea on template on basis of button slider.
   * @param param yes/no from template side.
   */
  // textAreaToggler(param) {
  //   if (param === "no") this.enableTextArea = true;
  //   else this.enableTextArea = false;
  // }
  /**
   * get submited form data.
   * @param post is reactive form's element(s) value.
   */
  // openBottomSheet(post): void {
  //   //this.bottomSheet.open(GreetingsComponent);
  //   this.comment = post.comment;
  //   this.togglerValue = post.togglerValue;
  //   if (
  //     this.togglerValue == "no" &&
  //     (this.comment == null || this.comment == "")
  //   ) {
  //     this.openSnackBar();
  //   }
  // }
  /**
   * Open material snackbar for error/success status.
   */
  // openSnackBar() {
  //   this.snackBar.open("Please add a valid comment", "Ok", {
  //     duration: 3000
  //   });
  // }
}
