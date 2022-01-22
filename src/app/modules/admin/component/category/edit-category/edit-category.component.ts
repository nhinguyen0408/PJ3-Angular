import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCategoryService } from 'src/app/services/category/api-category.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {

  constructor(private api: ApiCategoryService, private route: Router, private actRoute: ActivatedRoute) { }
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
    if(window.confirm("Bạn đã chắc chắn muốn thay đổi thông tin!!!!")){
      this.api.editCategory(this.category).subscribe((data: {})=>{
        this.route.navigate(['/admin/category'])
      })
    }
  }
  toggleEditable(e: any){
    console.log(e)
    if ( e.target.checked ) {
      this.category.status = "ENABLE";
    }
    if( !e.target.checked ) {
      this.category.status = "DISABLE";
    }
  }
}
