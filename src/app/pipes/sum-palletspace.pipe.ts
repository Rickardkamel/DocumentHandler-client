import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'sumPalletSpace'})

export class SumPalletSpacePipe implements PipeTransform {
    transform(values: any, args?: any[]): number {
       let sum = 0;
            values.forEach(element => {
                sum += element.vessel.palletSpace * element.quantity;
            });
       return sum;
    }
}
