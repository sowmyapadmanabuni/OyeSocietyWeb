import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(itemList: any, searchKeyword: string) {
    if (!itemList)
      return [];
    if (!searchKeyword)
      return itemList;
    let filteredList = [];
    if (itemList.length > 0) {
      searchKeyword = searchKeyword.toLowerCase();
      itemList.forEach(item => {
        //Object.values(item) => gives the list of all the property values of the 'item' object
        let propValueList = Object.values(item);
        for (let i = 0; i < propValueList.length; i++) {
          if (propValueList[i]) {
            if (propValueList[i].toString().toLowerCase().indexOf(searchKeyword) > -1) {
              filteredList.push(item);
              break;
            }
          }
        }
      });
    }
    return filteredList;
  }
 /* private searchKeyword: string = "";
  private Result = [];

  constructor() {

  }

  transform(items: any[], searchText: string): any[] {
    if (this.isObjNull(items)) return [-1];
    if (this.isObjNull(searchText)) return items;
    this.searchKeyword = searchText.toLowerCase();
    let res = items.filter(o => this.checkAgainstProperty(o.asAsnName));
    if (res.length === 0) {
      res = items.filter(o => this.checkAgainstProperty(o.asPrpName));
      if (res.length === 0) {
        res = items.filter(o => this.checkAgainstProperty(o.asAddress));
        if (res.length === 0) {
          res = items.filter(o => this.checkAgainstProperty(o.asNofBlks.toString()));
          if (res.length === 0) {
            res = items.filter(o => this.checkAgainstProperty(o.asNofUnit.toString()));
            if (res.length === 0) { return [-1]; }
          }
        }

      }
    }


    return res;
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
*/
}
