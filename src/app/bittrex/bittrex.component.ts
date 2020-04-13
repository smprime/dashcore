import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NetworkService } from '../services/network.service';

@Component({
  selector: 'app-bittrex',
  templateUrl: './bittrex.component.html',
  styleUrls: ['./bittrex.component.scss']
})
export class BittrexComponent implements OnInit, OnDestroy {
  state;
  setLoop;
  constructor(public networService: NetworkService) {
    
    this.state = {
      priceUsd: 112.5,
      priceEur: 103.1,
      priceGbp: 97.1,
      priceBtc: 0.01,
      explorer: 'insight.dash.org',
    }
    this.getPrice();
  }

  ngOnInit(): void {
    this.setLoop = setInterval(() => this.getPrice(), 10000);
  }
  getPrice() {
    fetch('https://dashcore.herokuapp.com/bittrexapi?data=public/getticker?market=USDT-DASH', {
      mode: 'cors',
      cache: 'no-cache',
    })
      .then(response => response.json())
      .then(data => {
        if(data){
          const {result } = data.message
          this.state = {
            ...this.state,
            priceUsd: result.Ask,
          }
        }
      });
  }
  showNumber(amount, decimals) {
    let result;
    switch (decimals) {
      case 3:
        result = this.setFloat(amount, 1000, decimals)
        break;
      case 4:
        result = this.setFloat(amount, 10000, decimals)
        if (result.length > 6 && amount > 0) result = result.substring(0, result.length - 1)
        break;
      case 5:
        result = this.setFloat(amount, 100000, decimals)
        if (result.length > 7 && amount > 0) result = result.substring(0, result.length - 1)
        break;
      case 6:
        result = this.setFloat(amount, 1000000, decimals)
        break;
      case 7:
        result = this.setFloat(amount, 10000000, decimals)
        break;
      case 8:
        result = this.setFloat(amount, 100000000, decimals)
        if (decimals > 2)
          for (var i = 0; i < 9; i++) {
            var isDot = result.endsWith('.')
            if (result.endsWith('0') || isDot) {
              result = result.substring(0, result.length - 1)
              if (isDot) break
            } else break
          }
        break;
      default:
        result = parseFloat(amount).toFixed(decimals)
        break;
    }
    return result

  }
  setFloat(amount, numerate, decimals) {
    return parseFloat((Math.round(amount * numerate) / numerate).toString()).toFixed(decimals);
  }
  ngOnDestroy() {
    this.setLoop = null;
  }


}

