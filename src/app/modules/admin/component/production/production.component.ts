import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { Production } from 'src/app/models/Production.model';
import { ApiProductionService } from 'src/app/services/production/api-production.service';


declare var jQuery: any;
@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.css']
})
export class ProductionComponent implements OnInit {

  constructor(private api: ApiProductionService) { }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.setDataTable()
    },200)
  }
  ngOnInit(): void {
    this.getAll();
    // (function ($) {
    //   $(document).ready(function(){
    //     // $('.textarea').summernote();
    //     $("#example1").DataTable({
    //       "responsive": true,
    //       "autoWidth": false,
    //     });
    //   });
    // })(jQuery);
  }
  loadDataTable(){
    (function ($) {
        // $('.textarea').summernote();
        $("#example1").DataTable({
          "responsive": true,
          "autoWidth": false,
        });
    })(jQuery);
  }
  productionList: Production[] = [];
  getAll(){
    this.api.getProduction().subscribe((res: any) => {
      this.productionList = res
    })
    console.log(this.productionList)
    // this.loadDataTable()
  }

  // delete(id: number){
  //   if(window.confirm("Are u sure????")){
  //     this.api.deleteProduction(id).subscribe(data => {
  //       this.getAll()
  //     })
  //   }
  // }
  setDataTable(){
    (function ($) {
        $("#example1").DataTable({
          "responsive": true,
          "autoWidth": false,
        });
    })(jQuery);
  }
}
