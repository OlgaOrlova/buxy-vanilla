import template from "./bar-chart.html";
import Chart from "chart.js";

import { CurrencyConverterUAH } from "../../services/currency-converter-uah";

export class BarChartComponent {
  constructor(mountPoint, props) {
    this.mountPoint = mountPoint;
    this.props = props;
  }

  querySelectors() {
    this.chartCtx = this.mountPoint.querySelector(".chart__visual");
  }

  update(data) {
    this.dataset = this.addCurrData(this.dataset, data);
    this.drawChanged();
  }

  createFromList(list) {
    this.dataset = list.reduce(this.addCurrData, this.dataset);
    this.drawChanged();
  }

  addCurrData(accum, item) {
    let data = accum;
    let amount = item.amount;
    if (item.account.currency !== "UAH") {
      amount = CurrencyConverterUAH.convert(item.account.currency, amount);
    }
    item.type === "-" ? (data.expence += amount) : (data.income += amount);
    return data;
  }

  drawChanged() {
    this.chart.data.datasets[0].data = [
      this.dataset.income,
      this.dataset.expence
    ];
    this.chart.update();
  }

  draw() {
    this.chart = new Chart(this.chartCtx, {
      type: "bar",
      data: {
        labels: ["Income", "Expense"],
        datasets: [
          {
            label: "Value",
            data: [this.dataset.income, this.dataset.expence],
            backgroundColor: ["#4caf50", "#f44336"]
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontFamily: "'Roboto', sans-serif",
                fontStyle: "500"
              }
            }
          ],
          xAxes: [
            {
              barPercentage: 0.5,
              ticks: {
                fontFamily: "'Roboto', sans-serif",
                fontStyle: "500"
              }
            }
          ]
        }
      }
    });
  }

  makeZeroDataset() {
    this.dataset = {
      income: 0,
      expence: 0
    };
  }

  mount() {
    this.mountPoint.innerHTML = template();
    this.querySelectors();
    this.makeZeroDataset();
    this.draw();
  }
}
