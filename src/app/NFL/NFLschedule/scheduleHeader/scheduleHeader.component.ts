import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-scheduleHeader',
  templateUrl: './scheduleHeader.component.html',
  styleUrls: ['./scheduleHeader.component.css']
})
export class NFLscheduleHeaderComponent implements OnInit {

  constructor (
    private router: Router,
    private route: ActivatedRoute) {}

  availableYears = [2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010];
  selectedScheduleYear = null;

  ngOnInit(){
    this.selectedScheduleYear = this.availableYears[0];
    this.router.navigate([this.selectedScheduleYear], {relativeTo: this.route})
  }

  onSelectedYearChanged() {
    this.router.navigate([this.selectedScheduleYear], {relativeTo: this.route})
  }
}
