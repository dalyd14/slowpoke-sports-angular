import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-NCAAFscheduleHeader',
  templateUrl: './NCAAFscheduleHeader.component.html',
  styleUrls: ['./NCAAFscheduleHeader.component.css']
})
export class NCAAFscheduleHeaderComponent implements OnInit {

  constructor (
    private router: Router,
    private route: ActivatedRoute) {}

  availableYears = [2020,2019,2018,2017,2016,2015,2014];
  selectedScheduleYear = null;

  ngOnInit(){
    this.selectedScheduleYear = this.availableYears[0];
    this.router.navigate([this.selectedScheduleYear], {relativeTo: this.route})
  }

  onSelectedYearChanged() {
    this.router.navigate([this.selectedScheduleYear], {relativeTo: this.route})
  }
}