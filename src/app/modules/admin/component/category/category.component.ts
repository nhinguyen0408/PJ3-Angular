import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/Category.model';
import { ApiCategoryService } from 'src/app/services/category/api-category.service';

declare var jQuery: any;
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  constructor(private api: ApiCategoryService) { }
  // ngAfterViewInit(): void {
  //   (function ($) {
  //     $(document).ready(function(){
  //       $("#example1").DataTable({
  //         "responsive": true,
  //         "autoWidth": false,
  //       });
  //     });
  //   })(jQuery);
  // }

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
    this.api.getCategory().subscribe((res: any) => {
      this.categoryList = res
    })
    console.log(this.categoryList)
  }

  delete(id: number){
    if(window.confirm("Are u sure????")){
      this.api.deleteCategory(id).subscribe(data => {
        this.getAll()
      })
    }
  }

}
