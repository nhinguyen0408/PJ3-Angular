import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Production } from 'src/app/models/Production.model';
import { ApiProductionService } from 'src/app/services/production/api-production.service';

@Component({
  selector: 'app-create-production',
  templateUrl: './create-production.component.html',
  styleUrls: ['./create-production.component.css']
})
export class CreateProductionComponent implements OnInit {

  constructor(private api: ApiProductionService, private router: Router ) { }

  ngOnInit(): void {
  }
  productionForm = new FormGroup({
    name: new FormControl('',[Validators.required]),
    company: new FormControl('', Validators.required)
  })

  production = new Production()

  onSubmit(){
    if(this.productionForm.valid){
      this.production.name = this.productionForm.value.name;
      this.production.company = this.productionForm.value.company;
      this.api.createProduction(this.production).subscribe((data: {}) => {
        alert("Success!!!!")
        this.router.navigate(['/admin/production'])
      })
    } else {
      alert("Vui lòng điền đủ các trường thông tin")
    }

  }
}
