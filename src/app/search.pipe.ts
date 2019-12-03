import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  
  private searchKeyword: string = "";
  private Result = [];

  constructor() {

  }

  transform(items: any[], searchBy: any[], searchText: string): any[] {
    if (this.isObjNull(items)) return [-1];
    if (this.isObjNull(searchText)) return items;
    this.searchKeyword = searchText.toLowerCase();
    if (items.length) {
      this.Result = items.filter(o => {
        for (let i = 0; i < searchBy.length; i++) {
          let k = searchBy[i];
          let cval = isNaN(o[k]) ? o[k] : o[k].toString();
          if (!this.checkAgainstProperty(cval)) {
            continue;
          } else {
            return true;
          }
        }
      })
    }
    return this.Result;
  }

  private checkAgainstProperty(property: any): boolean {
    let value: boolean = false;

    if (!this.isNullOrWhiteSpace(property)) {
      if (property.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) >= 0) {
        value = true;
      }
    }

    return value;
  }

  public isObjNull(obj: any, isNumber = false): boolean {
    let value: boolean = true;

    if (!isNumber && obj && obj != undefined && obj != null)
      value = false;
    else if (isNumber && obj != undefined && obj != null)
      value = false;

    return value;
  }

  public isNullOrWhiteSpace(obj: string): boolean {
    let value: boolean = true;

    if (!this.isObjNull(obj) && obj.trim() != "")
      value = false;

    return value;
  }

}
