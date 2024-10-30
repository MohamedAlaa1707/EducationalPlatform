import { HttpClient, HttpHandler, HttpRequest, HttpEvent, HttpHandlerFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { UserAuthService } from '../Services/User/user-auth.service';


export function AuthInterceptor(req: HttpRequest<any>, next: HttpHandlerFn) {
  let aut = inject(UserAuthService);
   // fetch token from local Storage
  const token = aut.getToken();
  if (token) {
         // we use clone to take copy from req because origin req We can't modify it.
    const clonedReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${token}`)
    });
     console.log(clonedReq)
    return next(clonedReq);
  }

  return next(req);
}
