import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCategoryService } from 'src/app/services/admin/category/api-category.service';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {

  constructor(private api: ApiCategoryService, private route: Router, private toastsService: ToastService, private actRoute: ActivatedRoute) { }
  id = this.actRoute.snapshot.params['id']
  category: any
  ngOnInit(): void {
    this.getCategoryById()
  }

  getCategoryById(){
    this.api.getById(Number(this.id)).subscribe((res: any)=>{
      this.category = res
    })
  }
  onSubmit(){
    console.log(this.category)
    if(this.category.name == ""){
      this.toastsService.alert("Thông báo!!!!",'Vui lòng điền tên thể loại !!!!', 'bg-warning')
    } else {
      if(window.confirm("Bạn đã chắc chắn muốn thay đổi thông tin!!!!")){
        this.api.editCategory(this.category).subscribe((data: {})=>{
          this.toastsService.alert("Thông báo!!!!",'Sửa thể loại thành công !!!!', 'bg-success')
          this.route.navigate(['/admin/category'])
        })
      }
    }

  }
  toggleEditable(e: any){
    console.log(e)
    if ( e.target.checked ) {
      this.category.status = "ENABLE";
      this.toastsService.alert("Thông báo!!!!",'Đổi trạng thái qua hoạt động !!!!', 'bg-info')
    }
    if( !e.target.checked ) {
      this.category.status = "DISABLE";
      this.toastsService.alert("Thông báo!!!!",'Đổi trạng thái qua không hoạt động !!!!', 'bg-info')
    }
  }
}
