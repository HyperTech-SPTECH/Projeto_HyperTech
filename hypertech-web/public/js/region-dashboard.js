function renderGraficoCargas() {
    const element = document.getElementById('graficoCargas');
    
    if (!element) {
        console.warn("Canvas 'graficoCargas' não encontrado.");
        return;
    }

    const ctx = element.getContext('2d');

    // Registro do plugin de data labels
    Chart.register(ChartDataLabels);

    // Criando um gradiente refinado para as barras
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0, 71, 143, 1)');   // Azul mais claro no topo
    gradient.addColorStop(1, 'rgba(0, 31, 63, 1)');    // Azul bem escuro na base

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Eletrônicos', 'Alimentos', 'Medicamentos', 'Bebidas', 'Cigarros', 'Vestuário'],
            datasets: [{
                label: 'Quantidade',
                data: [85, 60, 15, 70, 40, 85], 
                backgroundColor: gradient, 
                hoverBackgroundColor: '#001f3f',
                borderColor: '#002244',
                borderWidth: 1,
                borderRadius: 6, 
                borderSkipped: false,
                barPercentage: 0.7 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 40,    // Espaço aumentado para acomodar os rótulos de dados
                    bottom: 10,
                    left: 10,
                    right: 10
                }
            },
            plugins: {
                // Configuração dos Data Labels (Números acima das barras)
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    color: '#2c3e50',
                    font: {
                        weight: 'bold',
                        size: 14,
                        family: 'Arial'
                    },
                    formatter: Math.round,
                    offset: 4 // Pequeno afastamento da barra
                },
                title: {
                    display: false
                },
                legend: { display: false },
                tooltip: { 
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#000',
                    bodyColor: '#000',
                    borderColor: '#ddd',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { 
                        color: '#777',
                        font: { size: 12 }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100, // Ajustado para sobrar respiro no topo
                    grid: {
                        drawBorder: false,
                        color: 'rgba(0, 0, 0, 0.05)', // Linhas de fundo muito sutis
                        borderDash: [5, 5] // Linhas pontilhadas
                    },
                    ticks: { 
                        color: '#777',
                        padding: 10
                    }
                }
            }
        }
    });
}