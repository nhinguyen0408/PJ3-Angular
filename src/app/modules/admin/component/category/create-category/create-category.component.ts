import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/Category.model';
import { ApiCategoryService } from 'src/app/services/category/api-category.service';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {

  constructor(
    private api: ApiCategoryService,
    private router: Router,
    private toastsService: ToastService,
    ) { }

  ngOnInit(): void {
  }
  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    sortName: new FormControl('', Validators.required)
  })

  category = new Category()

  onSubmit(){
    if(this.categoryForm.valid){
      this.category.name = this.categoryForm.value.name;
    this.category.sortName = this.categoryForm.value.sortName;
    this.api.createCategory(this.category).subscribe((data: {}) => {
      this.toastsService.alert("Thông báo!!!!",'Thêm thể loại thành công !!!!', 'bg-success')
      this.router.navigate(['/admin/category'])
    })
    } else {
      // alert("Vui lòng điền đủ các trường thông tin")
      this.toastsService.alert("Thông báo!!!!",'Vui lòng điền đủ các trường thông tin !!!!', 'bg-warning')
    }

  }
}
