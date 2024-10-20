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
            if (!isNaN(value)) { // Додано перевірку на NaN
                histogramData[value] = (histogramData[value] || 0) + 1;
            }
        });
        return histogramData;
    };

    const roundedFrequencyHistogram = getHistogramData(roundedTemperatures);

    // Сортуємо дані
    const sortedRoundedKeys = tempRange.map(key => key.toString());
    const sortedRoundedValues = sortedRoundedKeys.map(key => roundedFrequencyHistogram[key] || 0);

    // Округлені значення середньої температури
    const uniqueTemperatures = Array.from(new Set(roundedTemperatures));
    const averageTemperatures = uniqueTemperatures.sort((a, b) => a - b).map(temp => temp.toString());

    // Кумулятивна частота для гістограми
    const cumulativeTempData = {};
    let cumulativeSum = 0;
    sortedRoundedKeys.forEach(key => {
        cumulativeSum += roundedFrequencyHistogram[key] || 0;
        cumulativeTempData[key] = cumulativeSum;
    });

    // Генеруємо HTML-файл
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
        <h1>Стахастична модель та гістограми</h1>
        
        <div>
            <h2>Симуляція випадкового блукання температури</h2>
            <canvas id="randomWalkHistogram" width="400" height="200"></canvas>
        </div>

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
            const ctx1 = document.getElementById('randomWalkHistogram').getContext('2d');
            const ctx2 = document.getElementById('tempHistogram').getContext('2d');
            const ctx3 = document.getElementById('cumulativeTempHistogram').getContext('2d');
            const ctx4 = document.getElementById('relativeTempHistogram').getContext('2d');
            const ctx5 = document.getElementById('cumulativeRelativeTempHistogram').getContext('2d');

            // Симуляція випадкового блукання температури
            new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: Array.from({ length: ${randomWalkValues.length} }, (_, i) => i),
                    datasets: [{
                        label: 'Випадкове блукання температури',
                        data: ${JSON.stringify(randomWalkValues)},
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'День'
                            }
                        },
                        y: {
                            beginAtZero: false,
                            title: {
                                display: true,
                                text: 'Температура (°C)'
                            }
                        }
                    }
                }
            });

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
                        label: 'Кумулятивна гістограма температур',
                        data: Object.values(cumulativeTempData).sort((a, b) => a - b),
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1,
                        fill: false
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

            // Гістограма відносної частоти температур
            const relativeTempData = ${JSON.stringify(relativeFrequencyHistogram)};
            new Chart(ctx4, {
                type: 'bar',
                data: {
                    labels: Object.keys(relativeTempData).sort((a, b) => a - b),
                    datasets: [{
                        label: 'Гістограма відносної частоти температур',
                        data: Object.values(relativeTempData).sort((a, b) => a - b),
                        backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        borderColor: 'rgba(255, 206, 86, 1)',
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

            // Кумулятивна гістограма відносної частоти температур
            const cumulativeRelativeTempData = ${JSON.stringify(cumulativeRelativeFrequencyHistogram)};
            new Chart(ctx5, {
                type: 'line',
                data: {
                    labels: Object.keys(cumulativeRelativeTempData).sort((a, b) => a - b),
                    datasets: [{
                        label: 'Кумулятивна гістограма відносної частоти температур',
                        data: Object.values(cumulativeRelativeTempData).sort((a, b) => a - b),
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        fill: false
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

    // Записуємо HTML у файл
    fs.writeFileSync('./output/results.html', chartHTML);
    console.log("Гістограми були успішно згенеровані у файлі results.html!");
};
