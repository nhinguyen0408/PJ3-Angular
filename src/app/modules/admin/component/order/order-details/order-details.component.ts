import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiBillService } from 'src/app/services/bill/api-bill.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  constructor(private api: ApiBillService, private actRoute: ActivatedRoute) { }
  id = this.actRoute.snapshot.params['id']

  ngOnInit(): void {
    this.getData();
    window.print();
  }
  bill: any
  getData(){
    this.api.getBillById(Number(this.id)).subscribe(res=>{
      this.bill = res;
    })
  }
}
