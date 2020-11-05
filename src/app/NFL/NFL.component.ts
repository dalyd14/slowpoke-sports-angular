import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-NFL',
  templateUrl: './NFL.component.html',
  styleUrls: ['./NFL.component.css']
})
export class NFLComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute
    ){}

  onGotoNFLschedules() {
    this.router.navigate(['schedules'], {relativeTo: this.route})
  }
}
