import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-category',
  templateUrl: './dashboard-category.component.html',
  styleUrls: ['./dashboard-category.component.css'],
})
export class DashboardCategoryComponent {

  config: any = {
    type: 'bar', // Alterado para gráfico de pizza
    data: {
      labels: ['Produto 1', 'Produto 2', 'Produto 3', 'Produto 4'], // Legendas
      datasets: [
        {
          label: ['Produto 1'],
          data: [467, 302, 102, 583],
          backgroundColor: [
            'rgba(0, 0, 255, 0.5)',   // Azul com 50% de transparência
          ],
          borderColor: ['blue'],
          borderWidth: 1, 
        },
        {
          label: ['Produto 2'],
          data: [767, 362, 402, 271],
          backgroundColor: [
            'rgba(255, 0, 0, 0.5)',   // Vermelho com 50% de transparência
          ],
          borderColor: ['red'],
          borderWidth: 1, 
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom', // Legenda na parte inferior
        },
        title: {
          display: true,
          text: 'Distribuição de Produtos (barra)', // Título do gráfico
        },
      },
    },
  };

  configPizza: any = {
    type: 'pie', // Alterado para gráfico de pizza
    data: {
      labels: ['Produto 1', 'Produto 2', 'Produto 3', 'Produto 4'], // Legendas
      datasets: [
        {
          data: [467, 302, 102, 583],
          backgroundColor: [
            'rgba(0, 0, 255, 0.5)',   // Azul com 50% de transparência
            'rgba(255, 0, 0, 0.5)',   // Vermelho com 50% de transparência
            'rgba(0, 128, 0, 0.5)',   // Verde com 50% de transparência
            'rgba(255, 255, 0, 0.5)', // Amarelo com 50% de transparência
          ],
          borderColor: ['blue', 'red', 'green', 'yellow'],
          borderWidth: 1, 
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom', // Legenda na parte inferior
        },
        title: {
          display: true,
          text: 'Distribuição de Produtos', // Título do gráfico
        },
      },
    },
  };

  chartPizza: any;
  chart: any;
  ngOnInit(): void {
    this.chart = new Chart('MyChart', this.config);
    this.chartPizza = new Chart('meuGraficoPizza', this.configPizza);
  }
}
