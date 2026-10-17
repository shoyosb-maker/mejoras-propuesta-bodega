/* ============================================================
   CHARTS.JS · Gráficas con Chart.js (responsive dinámico)
   ============================================================ */

(function initCharts(){
  if(typeof Chart === 'undefined'){
    window.addEventListener('load', initCharts);
    return;
  }

  const TEAL = '#1D7A7A';
  const NAVY = '#16293D';
  const OK = '#047857';
  const WARNING = '#B45309';
  const PURPLE = '#6D28D9';
  const BLUE = '#1E40AF';

  // Punto de quiebre para adaptar charts a móvil
  const mqMobile = window.matchMedia('(max-width: 640px)');

  const charts = { gantt:null, kpis:null, pagos:null };

  const ganttCanvas = document.getElementById('chartGantt');
  const kpiCanvas   = document.getElementById('chartKpis');
  const pagosCanvas = document.getElementById('chartPagos');

  /* ===================== GANTT ===================== */
  function buildGantt(){
    if(!ganttCanvas) return;
    if(charts.gantt){ charts.gantt.destroy(); charts.gantt = null; }

    const isMobile = mqMobile.matches;
    const ctx = ganttCanvas.getContext('2d');

    charts.gantt = new Chart(ctx, {
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
          data: [[0,1],[0,4],[2,6],[4,12],[10,15],[14,16]],
          backgroundColor: [TEAL, BLUE, PURPLE, NAVY, WARNING, OK],
          borderRadius: 6,
          barThickness: isMobile ? 18 : 24
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {display:false},
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const v = ctx.raw;
                return `Semana ${v[0]+1} a ${v[1]}`;
              }
            }
          }
        },
        scales: {
          x: {
            min: 0, max: 16,
            ticks: {
              stepSize: 2,
              font: {size: isMobile ? 10 : 12},
              callback: (v) => `S${v}`
            },
            grid: {color:'#EEF3F7'}
          },
          y: {
            grid: {display:false},
            ticks: {font: {size: isMobile ? 10.5 : 12, weight:'600'}}
          }
        }
      }
    });
  }

  /* ===================== KPIs IMPACTO ===================== */
  function buildKpis(){
    if(!kpiCanvas) return;
    if(charts.kpis){ charts.kpis.destroy(); charts.kpis = null; }

    const isMobile = mqMobile.matches;
    const ctx = kpiCanvas.getContext('2d');

    // En móvil las barras se giran (indexAxis:'y') para que los labels
    // largos del eje X no se corten ni se roten a 45°.
    const xAxis = {
      grid: {display:false},
      ticks: {font: {size: isMobile ? 10.5 : 11, weight:'600'}}
    };
    const yAxis = {
      beginAtZero: true,
      max: 60,
      ticks: {callback: (v) => v+'%', font:{size: isMobile ? 10 : 11}},
      grid: {color:'#EEF3F7'}
    };

    charts.kpis = new Chart(ctx, {
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
          backgroundColor: [OK, TEAL, BLUE, PURPLE, WARNING, NAVY],
          borderRadius: 8,
          barThickness: isMobile ? 20 : 30
        }]
      },
      options: {
        indexAxis: isMobile ? 'y' : 'x',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {display:false},
          tooltip: {
            callbacks: {
              label: (ctx) => `Mejora: ${ctx.raw}%`
            }
          }
        },
        scales: isMobile
          ? { x: yAxis, y: xAxis }   // girado: % va al eje X, labels al Y
          : { x: xAxis, y: yAxis }   // normal: labels al X, % al Y
      }
    });
  }

  /* ===================== DISTRIBUCIÓN DE PAGOS ===================== */
  function buildPagos(){
    if(!pagosCanvas) return;
    if(charts.pagos){ charts.pagos.destroy(); charts.pagos = null; }

    const isMobile = mqMobile.matches;
    const ctx = pagosCanvas.getContext('2d');

    charts.pagos = new Chart(ctx, {
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
            position: isMobile ? 'bottom' : 'right',
            labels: {
              font: {size: isMobile ? 11 : 12, weight:'600'},
              padding: isMobile ? 10 : 12,
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 10,
              boxHeight: 10
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
        // En móvil, dona un poco más chica para dejar espacio a la leyenda inferior
        cutout: isMobile ? '58%' : '62%'
      }
    });
  }

  /* ===================== ORQUESTADOR ===================== */
  function buildAll(){
    buildGantt();
    buildKpis();
    buildPagos();
  }

  // Debounce para re-render al cruzar el breakpoint
  let resizeTimer;
  function onBreakpointChange(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildAll, 120);
  }

  if(typeof mqMobile.addEventListener === 'function'){
    mqMobile.addEventListener('change', onBreakpointChange);
  } else if(typeof mqMobile.addListener === 'function'){
    // Safari antiguo
    mqMobile.addListener(onBreakpointChange);
  }

  buildAll();

})();