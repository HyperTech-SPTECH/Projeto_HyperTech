const heatmapData = [
    { day: "Seg", risks: ["B", "B", "B", "B", "B", "M", "M", "B"] },
    { day: "Ter", risks: ["B", "B", "B", "B", "B", "A", "M", "B"] },
    { day: "Qua", risks: ["B", "B", "B", "B", "M", "A", "M", "B"] },
    { day: "Qui", risks: ["B", "B", "B", "A", "A", "M", "M", "B"] },
    { day: "Sex", risks: ["B", "B", "B", "B", "M", "A", "A", "B"] },
    { day: "Sab", risks: ["A", "A", "B", "B", "M", "A", "A", "B"] },
    { day: "Dom", risks: ["B", "B", "B", "B", "M", "B", "B", "B"] }
];

const timeList = ["00h-03h", "03h-06h", "06h-09h", "09h-12h", "12h-15h", "15h-18h", "18h-21h", "21h-00h"];

function renderHeatmap() {
    const gridContainer = document.getElementById('heatmap-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';

    const emptyCell = document.createElement('div');
    gridContainer.appendChild(emptyCell);

    timeList.forEach(time => {
        const timeDiv = document.createElement('div');
        timeDiv.className = 'heatmap__time-header';
        timeDiv.textContent = time;
        gridContainer.appendChild(timeDiv);
    });

    heatmapData.forEach(row => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'heatmap__day-label';
        dayDiv.textContent = row.day;
        gridContainer.appendChild(dayDiv);

        row.risks.forEach(riskValue => {
            const blockContainer = document.createElement('div');
            
            let modifierClass = '';
            if (riskValue === 'B') modifierClass = 'heatmap__block--baixo';
            else if (riskValue === 'M') modifierClass = 'heatmap__block--medio';
            else if (riskValue === 'A') modifierClass = 'heatmap__block--alto';

            blockContainer.innerHTML = `<div class="heatmap__block ${modifierClass}">${riskValue}</div>`;
            gridContainer.appendChild(blockContainer);
        });
    });
}

document.addEventListener('DOMContentLoaded', renderHeatmap);