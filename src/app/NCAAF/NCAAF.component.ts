import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-NCAAF',
  templateUrl: './NCAAF.component.html',
  styleUrls: ['./NCAAF.component.css']
})
export class NCAAFComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute
    ){}

  onGotoNCAAFschedules() {
    this.router.navigate(['schedules'], {relativeTo: this.route})
  }
}