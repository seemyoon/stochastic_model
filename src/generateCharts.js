import fs from 'fs';

export const generateCharts = (temperatures, randomWalkValues, frequencyHistogram, cumulativeFrequencyHistogram, relativeFrequencyHistogram, cumulativeRelativeFrequencyHistogram) => {
    // Округлення температур до цілих чисел
    const roundedTemperatures = temperatures.map(temp => Math.round(temp));

    // Створюємо діапазон від -10 до 12
    const tempRange = Array.from({ length: 23 }, (_, i) => -10 + i); // від -10 до 12 включно

    // Функція для отримання даних гістограми
    const getHistogramData = (data) => {
        const histogramData = {};
        data.forEach(value => {
            if (!isNaN(value)) {
                histogramData[value] = (histogramData[value] || 0) + 1;
            }
        });
        return histogramData;
    };

    const roundedFrequencyHistogram = getHistogramData(roundedTemperatures);

    // Сортуємо дані
    const sortedRoundedKeys = tempRange.map(key => key.toString());
    const sortedRoundedValues = sortedRoundedKeys.map(key => roundedFrequencyHistogram[key] || 0);

    // Кумулятивна частота для гістограми
    const cumulativeTempData = {};
    let cumulativeSum = 0;
    sortedRoundedKeys.forEach(key => {
        cumulativeSum += roundedFrequencyHistogram[key] || 0;
        cumulativeTempData[key] = cumulativeSum;
    });

    // Відносна частота
    const relativeTempData = {};
    const relativeSortedData = tempRange.map(key => {
        const count = relativeFrequencyHistogram[key] || 0;
        relativeTempData[key] = count;
        return count;
    });

    const chartHTML = `
    <!DOCTYPE html>
    <html lang="uk">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Гістограми</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            body {
                font-family: Arial, sans-serif;
            }
            .chart-container {
                width: 100%;
                display: flex;
                justify-content: space-around;
                flex-wrap: wrap;
                margin-bottom: 30px;
            }
            .chart-box {
                width: 45%; /* Задаємо ширину для кожного блоку */
                margin: 10px;
            }
            h1, h2 {
                text-align: center;
            }
        </style>
    </head>
    <body>
        <h1>Стахостична модель та гістограми</h1>
        
        <h2>Гістограми температур</h2>
        <div class="chart-container">
            <div class="chart-box">
                <canvas id="tempHistogram" width="400" height="200"></canvas>
            </div>
            <div class="chart-box">
                <canvas id="cumulativeTempHistogram" width="400" height="200"></canvas>
            </div>
            <div class="chart-box">
                <canvas id="relativeTempHistogram" width="400" height="200"></canvas>
            </div>
            <div class="chart-box">
                <canvas id="cumulativeRelativeTempHistogram" width="400" height="200"></canvas>
            </div>
        </div>

        <script>
            const ctx2 = document.getElementById('tempHistogram').getContext('2d');
            const ctx3 = document.getElementById('cumulativeTempHistogram').getContext('2d');
            const ctx4 = document.getElementById('relativeTempHistogram').getContext('2d');
            const ctx5 = document.getElementById('cumulativeRelativeTempHistogram').getContext('2d');

            // Гістограма температур
            const tempHistogramData = ${JSON.stringify(roundedFrequencyHistogram)};
            const sortedTempData = ${JSON.stringify(sortedRoundedValues)};

            new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: ${JSON.stringify(sortedRoundedKeys)},
                    datasets: [{
                        label: 'Гістограма частот температур',
                        data: sortedTempData,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Температура (°C)'
                            },
                            ticks: {
                                autoSkip: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Частота'
                            }
                        }
                    }
                }
            });

            // Кумулятивна гістограма температур
            const cumulativeTempData = ${JSON.stringify(cumulativeTempData)};
            new Chart(ctx3, {
                type: 'line',
                data: {
                    labels: Object.keys(cumulativeTempData).sort((a, b) => a - b),
                    datasets: [{
                        label: 'Кумулятивна частота температур',
                        data: Object.values(cumulativeTempData).sort((a, b) => a - b),
                        fill: false,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Температура (°C)'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Кумулятивна частота'
                            }
                        }
                    }
                }
            });

            // Відносна частота
            const relativeHistogramData = ${JSON.stringify(relativeTempData)};
            const relativeSortedData = ${JSON.stringify(relativeSortedData)};

            new Chart(ctx4, {
                type: 'bar',
                data: {
                    labels: ${JSON.stringify(tempRange)},
                    datasets: [{
                        label: 'Відносна частота температур',
                        data: relativeSortedData,
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Температура (°C)'
                            },
                            ticks: {
                                autoSkip: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Відносна частота'
                            }
                        }
                    }
                }
            });

            // Кумулятивна відносна частота
            const cumulativeRelativeData = ${JSON.stringify(cumulativeRelativeFrequencyHistogram)};
            new Chart(ctx5, {
                type: 'line',
                data: {
                    labels: Object.keys(cumulativeRelativeData).sort((a, b) => a - b),
                    datasets: [{
                        label: 'Кумулятивна відносна частота температур',
                        data: Object.values(cumulativeRelativeData).sort((a, b) => a - b),
                        fill: false,
                        borderColor: 'rgba(255, 159, 64, 1)',
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Температура (°C)'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Кумулятивна відносна частота'
                            }
                        }
                    }
                }
            });
        </script>
    </body>
    </html>
    `;

    // Збереження HTML-файлу
    fs.writeFileSync('./output/results.html', chartHTML);
    console.log('Графіки збережено у output/results.html');
};
