import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class GlobalEventsManager {
   public showNavBar = new EventEmitter<boolean>();
}
