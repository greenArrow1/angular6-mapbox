import {ErrorHandler} from '@angular/core';
import {AuthorizationError} from './AuthorizationError';
 
export class CustomErrorHandler extends ErrorHandler {
    constructor(){
        super();
    }
 
    public handleError(error: any): void {
        if(error.originalError instanceof AuthorizationError){
            console.info(`[CUSTOM ERROR]:::${error.originalError.toString()}`);
        } else {
            let errorData:any;
            super.handleError(error);
            errorData = JSON.stringify(error);
            sessionStorage.setItem('error', errorData);
            //console.error(`this is the error ${error.message.toString()}`)
        }
    }
}