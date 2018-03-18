import template from "./pie-chart.html";
import Chart from "chart.js";

import { CurrencyConverterUAH } from "../../services/currency-converter-uah";
import { ColorGenerator } from "../../services/color-generator";

export class PieChartComponent {
  constructor(mountPoint) {
    this.mountPoint = mountPoint;
  }

  querySelectors() {
    this.chartCtx = this.mountPoint.querySelector(".chart__visual");
  }

  update(data) {
    if (data.type === "+") {
      return;
    }
    this.dataset = this.addCurrData(this.dataset, data);
    this.drawChanged();
  }

  createFromList(list) {
    let expenceList = list.filter(item => item.type === "-").reverse();
    this.dataset = expenceList.reduce(this.addCurrData, this.dataset);
    this.drawChanged();
  }

  addCurrData(accum, item) {
    let data = accum;
    let amount = item.amount;
    if (item.account.currency !== "UAH") {
      amount = CurrencyConverterUAH.convert(item.account.currency, amount);
    }
    const i = accum.tags.indexOf(item.tag);
    if (i < 0) {
      data.tags.push(item.tag);
      data.amounts.push(amount);
      data.colors.push(ColorGenerator.get());
    } else {
      data.amounts[i] += amount;
    }
    return data;
  }

  drawChanged() {
    this.chart.data.datasets[0].data = this.dataset.amounts;
    this.chart.data.datasets[0].backgroundColor = this.dataset.colors;
    this.chart.data.labels = this.dataset.tags;
    this.chart.update();
  }

  draw() {
    this.chart = new Chart(this.chartCtx, {
      type: "pie",
      data: {
        datasets: [
          {
            data: this.dataset.amounts,
            backgroundColor: this.dataset.colors
          }
        ],
        labels: this.dataset.tags
      },
      options: {
        legend: {
          position: "right",
          labels: {
            fontFamily: "Roboto, sans-serif",
            fontSize: 14
          }
        }
      }
    });
  }

  makeZeroDataset() {
    this.dataset = {
      tags: [],
      amounts: [],
      colors: []
    };
  }

  mount() {
    this.mountPoint.innerHTML = template();
    this.querySelectors();
    this.makeZeroDataset();
    this.draw();
  }
}
