import {Injectable} from '@angular/core';

@Injectable()
export class SpinnerService {
 static isLoading: boolean = false;;

 static setSpinner(isLoading: boolean): void {
    console.log(isLoading);
    this.isLoading = isLoading;
  }
  static getSpinner(): boolean {
    return this.isLoading;
  }


}