import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiProductionService } from 'src/app/services/admin/production/api-production.service';
import { ToastService } from 'src/app/services/toasts-alert/toast.service';

@Component({
  selector: 'app-edit-production',
  templateUrl: './edit-production.component.html',
  styleUrls: ['./edit-production.component.css']
})
export class EditProductionComponent implements OnInit {

  constructor(private api: ApiProductionService, private route: Router, private toastsService: ToastService, private actRoute: ActivatedRoute) { }
  id = this.actRoute.snapshot.params['id']
  production: any
  ngOnInit(): void {
    this.getProductionById()
  }

  getProductionById(){
    this.api.getById(Number(this.id)).subscribe((res: any)=>{
      this.production = res
    })
  }
  onSubmit(){
    console.log(this.production)
    if(this.production.name =="" || this.production.company == ""){
      this.toastsService.alert('Thông báo !!!', 'Vui lòng điền đủ thông tin!!!','bg-warning');
    } else {
      if(window.confirm("Bạn đã chắc chắn muốn thay đổi thông tin!!!!")){
        this.api.editProduction(this.production).subscribe((data: {})=>{
          this.toastsService.alert('Thông báo !!!', 'Sửa Hãng thành công !!!','bg-success');
          this.route.navigate(['/admin/production'])
        })
      }
    }

  }
  toggleEditable(e: any){
    console.log(e)
    if ( e.target.checked ) {
      this.production.status = "ENABLE";
      this.toastsService.alert("Thông báo!!!!",'Đổi trạng thái qua hoạt động !!!!', 'bg-info')
    }
    if( !e.target.checked ) {
      this.production.status = "DISABLE";
      this.toastsService.alert("Thông báo!!!!",'Đổi trạng thái qua không hoạt động !!!!', 'bg-info')
    }
  }

}
