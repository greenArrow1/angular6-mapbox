import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  static errorArr: any = [];

  static log(msg: string): void {
    console.log(msg);
  }
  static setError(error: any): void {
    this.errorArr.push(error);
  }

  static error(msg: string, obj = {}): void {
    console.error(msg, obj);
  }
  static getErrorList(){
    return this.errorArr;
  }
}