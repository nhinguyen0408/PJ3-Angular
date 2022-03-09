import { Injectable } from '@angular/core';

declare var jQuery: any;
@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }
  //  bg-success
  //  bg-info
  //  bg-warning
  //  bg-danger
  //  bg-maroon
  $:any;
  alert(title: string, body: string, background: string){
    (function ($) {
      $(document).Toasts('create', {
        class: background,
        width: 700,
        height: 150,
        title: title,
        subtitle: '',
        body: body,
        autohide: true,
        delay: 3000
      })
    })(jQuery);
  }

}
