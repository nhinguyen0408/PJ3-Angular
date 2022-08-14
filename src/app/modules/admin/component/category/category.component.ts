import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/Category.model';
import { ApiCategoryService } from 'src/app/services/admin/category/api-category.service';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';

declare var jQuery: any;
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  constructor(private api: ApiCategoryService, private toastsService: ToastService) { }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.setDataTable()
    },500)
  }

  ngOnInit(): void {
    this.getAll();
    // (function ($) {
    //   $(document).ready(function(){
    //     $("#example1").DataTable({
    //       "responsive": true,
    //       "autoWidth": false,
    //     });
    //   });
    // })(jQuery);
  }
  categoryList: Category[] = [];
  getAll(){
    this.api.getCategory('DATE').subscribe((res: any) => {
      this.categoryList = res
    })
  }

  // delete(id: number){
  //   if(window.confirm("Are u sure????")){
  //     this.api.deleteCategory(id).subscribe(data => {
  //       this.toastsService.alert('Thông báo !!!', 'Xóa thể loại thành công!!!','bg-warning');
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
