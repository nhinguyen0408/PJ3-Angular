export class Category{
  id: number = 0;
  name: string = "";
  title: string = "";
  sortName: string = "";
  status: string = "";
  countProd: number | null = null;
  createdDate: Date = new Date();
  modifiedDate: Date = new Date();
}
