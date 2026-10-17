/* ============================================================
   CHARTS.JS · Gráficas con Chart.js
   ============================================================ */

(function initCharts(){
  if(typeof Chart === 'undefined'){
    // Chart.js aún no cargó, esperar
    window.addEventListener('load', initCharts);
    return;
  }

  const TEAL = '#1D7A7A';
  const NAVY = '#16293D';
  const OK = '#047857';
  const WARNING = '#B45309';
  const PURPLE = '#6D28D9';
  const BLUE = '#1E40AF';

  /* ===================== GANTT ===================== */
  const ganttCanvas = document.getElementById('chartGantt');
  if(ganttCanvas){
    const ctx = ganttCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'F0 · Inicio',
          'F1 · Descubrimiento',
          'F2 · Base técnica',
          'F3 · Construcción',
          'F4 · Validación',
          'F5 · Despliegue'
        ],
        datasets: [{
          label: 'Semanas',
          data: [
            [0, 1],
            [0, 4],
            [2, 6],
            [4, 12],
            [10, 15],
            [14, 16]
          ],
          backgroundColor: [
            TEAL,
            BLUE,
            PURPLE,
            NAVY,
            WARNING,
            OK
          ],
          borderRadius: 6,
          barThickness: 24
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {display: false},
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const v = ctx.raw;
                return `Semana ${v[0] + 1} a ${v[1]}`;
              }
            }
          }
        },
        scales: {
          x: {
            min: 0,
            max: 16,
            ticks: {
              stepSize: 2,
              callback: (v) => `S${v}`
            },
            grid: {color: '#EEF3F7'}
          },
          y: {
            grid: {display: false},
            ticks: {font: {size: 12, weight: '600'}}
          }
        }
      }
    });
  }

  /* ===================== KPIs DE IMPACTO ===================== */
  const kpiCanvas = document.getElementById('chartKpis');
  if(kpiCanvas){
    const ctx = kpiCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Tiempo en reportes',
          'Errores de inventario',
          'Velocidad de despacho',
          'Pérdida de activos',
          'Compras de emergencia',
          'Horas administrativas'
        ],
        datasets: [{
          label: 'Mejora esperada (%)',
          data: [40, 30, 25, 50, 35, 30],
          backgroundColor: [
            OK,
            TEAL,
            BLUE,
            PURPLE,
            WARNING,
            NAVY
          ],
          borderRadius: 8,
          barThickness: 30
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {display: false},
          tooltip: {
            callbacks: {
              label: (ctx) => `Mejora: ${ctx.raw}%`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 60,
            ticks: {callback: (v) => v + '%'},
            grid: {color: '#EEF3F7'}
          },
          x: {
            grid: {display: false},
            ticks: {font: {size: 11, weight: '600'}}
          }
        }
      }
    });
  }

  /* ===================== DISTRIBUCIÓN DE PAGOS ===================== */
  const pagosCanvas = document.getElementById('chartPagos');
  if(pagosCanvas){
    const ctx = pagosCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [
          'Inicio y levantamiento (30%)',
          'Diseño aprobado (30%)',
          'Piloto (25%)',
          'Aceptación final (15%)'
        ],
        datasets: [{
          data: [30, 30, 25, 15],
          backgroundColor: [TEAL, BLUE, PURPLE, OK],
          borderWidth: 3,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {size: 12, weight: '600'},
              padding: 12,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const value = ctx.raw;
                const total = 22000000;
                const amount = (total * value / 100).toLocaleString('es-CO');
                return `${ctx.label}: $${amount}`;
              }
            }
          }
        },
        cutout: '62%'
      }
    });
  }

})();