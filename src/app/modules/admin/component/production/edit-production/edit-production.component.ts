import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiProductionService } from 'src/app/services/production/api-production.service';

@Component({
  selector: 'app-edit-production',
  templateUrl: './edit-production.component.html',
  styleUrls: ['./edit-production.component.css']
})
export class EditProductionComponent implements OnInit {

  constructor(private api: ApiProductionService, private route: Router, private actRoute: ActivatedRoute) { }
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
    if(window.confirm("Bạn đã chắc chắn muốn thay đổi thông tin!!!!")){
      this.api.editProduction(this.production).subscribe((data: {})=>{
        this.route.navigate(['/admin/production'])
      })
    }
  }
  toggleEditable(e: any){
    console.log(e)
    if ( e.target.checked ) {
      this.production.status = "ENABLE";
    }
    if( !e.target.checked ) {
      this.production.status = "DISABLE";
    }
  }

}
