import { Pipe, PipeTransform } from '@angular/core';
import { DataSession } from '@df_models/data-session.model';

@Pipe({
  name: 'amountDisplay',
})
export class AmountDisplayPipe implements PipeTransform {
  transform(value: string): string {
    const datasessionLst = localStorage.getItem('datasession');
    try {
    const datasession = JSON.parse(datasessionLst) as DataSession;
    const currentCurrency = datasession?.currentcurrency ?  datasession.currentcurrency : datasession?.currentCompanyInfo?.currentcurrency;
    if (currentCurrency === 529) {
      return `${value}$`;
    };
    } catch (error) {
      console.log(error);
    }
    return `$${value}`;
  }
}
