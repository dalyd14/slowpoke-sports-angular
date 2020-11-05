import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from './authentication.service';
import { exhaustMap, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor (private authService: AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService.ownerFirebase.pipe(
            take(1),
            exhaustMap(owner => {
                if (!owner) {
                    return next.handle(req)
                }
                const modifiedReq = req.clone({
                    params: new HttpParams().set('auth', owner.token)
                })
                return next.handle(modifiedReq)                
            })
        );
    }
}