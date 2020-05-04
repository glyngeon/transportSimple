import { Component, ElementRef, ViewChild, Renderer2, OnInit, AfterViewInit } from '@angular/core';

import { dummySearch } from './models/locationdata';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'transportSimple';
  @ViewChild('dropdownElement', { read: ElementRef }) dropdownElement: ElementRef;
  @ViewChild('progressBody', { read: ElementRef }) progressBody: ElementRef;

  public locationArray = [];
  public fromLocationValue: string;
  public toLocationValue: string;
  public isLocationErrorFlag: boolean;
  public newLocationValue: string;
  public showInputFlag: boolean;
  public showAddFromButtonFlag: boolean;
  public showAddToButtonFlag: boolean;
  public fromShotLocationName: string;
  public toShotLocationName: string;
  public saveFromJourneyArray: any = [];
  public saveToJourneyArray: any = [];
  private checkArrayLocationIndex: number;
  private checkProgessLevelFlag: boolean;
  private progressBarHighlightDOM: HTMLElement;

  constructor(private renderer: Renderer2) {
    this.locationArray = dummySearch;
  }

  ngOnInit() {
    this.showInputFlag = false;
    this.showAddFromButtonFlag = false;
    this.showAddToButtonFlag = false;
    this.checkArrayLocationIndex = 1;
    this.checkProgessLevelFlag = false;
  }

  ngAfterViewInit() {
    this.progressBarHighlightDOM = this.dropdownElement.nativeElement.querySelector('.progress-bar-container');
  }

  public fromLocationChange() {
    this.showAddFromButtonFlag = true;
    this.showAddToButtonFlag = false;
    const locationIdValue = this.locationArray.find(element => {
      return element.location === this.fromLocationValue;
    });
    this.fromShotLocationName = (locationIdValue && locationIdValue.locationShotName) ? locationIdValue.locationShotName : null;
    if (this.locationArray.includes(this.fromLocationValue)) {
      this.showAddFromButtonFlag = true;
      this.isLocationErrorFlag = false;
    } else {
      this.isLocationErrorFlag = true;
    }
  }

  public fromKeyUp() {
    this.showAddFromButtonFlag = true;
    this.showAddToButtonFlag = false;
  }

  public toKeyUp() {
    this.showAddToButtonFlag = true;
    this.showAddFromButtonFlag = false;
  }

  public toLocationChange() {
    this.showAddToButtonFlag = true;
    this.showAddFromButtonFlag = false;
    const locationIdValue = this.locationArray.find(element => {
      return element.location === this.toLocationValue;
    });
    this.toShotLocationName = (locationIdValue && locationIdValue.locationShotName) ? locationIdValue.locationShotName : null;
    if (this.locationArray.includes(this.toLocationValue)) {
      this.showAddToButtonFlag = true;
      this.isLocationErrorFlag = false;
    } else {
      this.isLocationErrorFlag = true;
    }
  }

  public addNewLocationButton() {
    this.showInputFlag = !this.showInputFlag;
  }

  public saveNewLocationEntry() {
    let tempObj = {
      id: this.locationArray.length,
      location: this.newLocationValue,
      locationShotName: this.newLocationValue.substring(0, 3).toUpperCase()
    };
    dummySearch.unshift(tempObj);
    if (this.showInputFlag && this.showAddFromButtonFlag) {
      this.fromLocationValue = this.newLocationValue;
      this.fromShotLocationName = tempObj.locationShotName;
    } else if (this.showInputFlag && this.showAddToButtonFlag) {
      this.toLocationValue = this.newLocationValue;
      this.toShotLocationName = tempObj.locationShotName;
    }
    this.showInputFlag = false;
    this.newLocationValue = null;
    tempObj = {
      id: null,
      location: null,
      locationShotName: null
    };
  }

  public CancelNewLocationEntry() {
    this.newLocationValue = null;
    this.showInputFlag = false;
  }

  public onSaveJourney(form: NgForm) {
    const locationIdValue1 = this.locationArray.find(element => {
      return element.location === this.fromLocationValue;
    });
    const locationIdValue2 = this.locationArray.find(element => {
      return element.location === this.toLocationValue;
    });
    let tempObj = {
      location1: (locationIdValue1 && locationIdValue1.location) ? locationIdValue1.location : null,
      locationShotName1: (locationIdValue1 && locationIdValue1.locationShotName) ? locationIdValue1.locationShotName : null,
      location2: (locationIdValue2 && locationIdValue2.location) ? locationIdValue2.location : null,
      locationShotName2: (locationIdValue2 && locationIdValue2.locationShotName) ? locationIdValue2.locationShotName : null
    };

    this.saveFromJourneyArray.push(tempObj);
    tempObj = {
      location1: null,
      locationShotName1: null,
      location2: null,
      locationShotName2: null
    };
    form.reset();
    setTimeout(() => {
      this.progressBar();
    });
  }

  // function for progress bar
  private progressBar() {
    const tempArrayLength = this.saveFromJourneyArray.length;
    const progressBarDom = (this.progressBarHighlightDOM as HTMLElement).querySelectorAll('.progress-bar-body');
    if (tempArrayLength > 1) {
      if (this.saveFromJourneyArray[this.checkArrayLocationIndex - 1].location2 === this.saveFromJourneyArray[this.checkArrayLocationIndex].location1) {
        if (this.checkProgessLevelFlag) {
          this.renderer.setStyle(progressBarDom[this.checkArrayLocationIndex], 'margin', '-2rem 0 0');
        } else {
          this.renderer.setStyle(progressBarDom[this.checkArrayLocationIndex], 'margin', '0.1rem');
        }
        this.checkArrayLocationIndex++;
        return;
      } else if (this.saveFromJourneyArray[this.checkArrayLocationIndex - 1].location2 !== this.saveFromJourneyArray[this.checkArrayLocationIndex].location1) {
        if (this.saveFromJourneyArray[0].location1 === this.saveFromJourneyArray[this.checkArrayLocationIndex].location2) {
          this.renderer.setStyle(progressBarDom[this.checkArrayLocationIndex], 'margin', '0.1rem');
          this.checkProgessLevelFlag = false;
          this.renderer.setStyle(progressBarDom[this.checkArrayLocationIndex], 'margin', '0.1rem');
          this.checkArrayLocationIndex++;
          return;
        }
        else {
          this.renderer.setStyle(progressBarDom[this.checkArrayLocationIndex], 'margin', '-2rem 0 0');
          this.checkProgessLevelFlag = true;
          this.checkArrayLocationIndex++;
          return;
        }
      }
    }
  }
}
