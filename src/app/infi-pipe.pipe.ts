import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'infiPipe'
})
export class InfiPipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(args){
      if(args[0] == false){
        return "∞";
      }
    }
    return (value == 1000 || value == -1000 || value == null) ? "∞" : value;
  }

}
