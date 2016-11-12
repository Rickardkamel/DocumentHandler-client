import { GlobalEventsManager } from '../shared/globalEventsManager';
import { AuthService } from '../shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { HeaderService } from './header.service';

import { IRegion } from '../shared/';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  providers: [AuthService],
  // directives:[ROUTER_DIRECTIVES]
})

@Injectable()
export class HeaderComponent implements OnInit {
  loggedIn: boolean;
  title: string = 'Customer Dokument';
  createRegionForm: FormGroup;

  @ViewChild('toolModal') public toolModal: ModalDirective;

  constructor(private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService,
    private globalEventsManager: GlobalEventsManager) { }

  logout() {
    this.authService.logout();
    this.globalEventsManager.showNavBar.emit(false);
  }

  ngOnInit(): any {

    this.createRegionForm = new FormGroup({
      regionName: new FormControl(),
    });

    this.globalEventsManager.showNavBar.subscribe(
      (value) => this.loggedIn = value
    );

    this.loggedIn = this.authService.isUserLoggedIn();
  }

  onCreateRegion(regionName: string) {

    this.headerService.getRegions().subscribe(
      regions => {
        let allRegions = regions;
        for (let i = 0; i < allRegions.length; i++) {
          if (regionName.toLowerCase() === allRegions[i].name.toLowerCase()) {
            alert('Det finns redan en region med detta namn! Vänligen välj ett annat namn.');
            return;
          }
        }
        this.headerService.postRegion(regionName).subscribe(
          (res) => {
            if (this.router.url === '/regions') {
              location.reload();
            }
            this.hideToolModal();
          }
        );
      }
    );
  }
  
  public showToolModal(): void {
    this.toolModal.show();
  }

  public hideToolModal(): void {
    this.toolModal.hide();
  }

}
