import fs from 'fs';

export const generateCharts = (temperatures, randomWalkValues, frequencyHistogram, cumulativeFrequencyHistogram, relativeFrequencyHistogram, cumulativeRelativeFrequencyHistogram) => {
    // Округление температур до ближайших 5 градусов
    const roundedTemperatures = temperatures.map(temp => Math.round(temp / 5) * 5);

    // Создаем диапазон от -10 до 12
    const tempRange = Array.from({ length: 23 }, (_, i) => -10 + i); // от -10 до 12 включительно

    // Функция для получения данных гистограммы
    const getHistogramData = (data) => {
        const histogramData = {};
        data.forEach(value => {
            histogramData[value] = (histogramData[value] || 0) + 1;
        });
        return histogramData;
    };

    const roundedFrequencyHistogram = getHistogramData(roundedTemperatures);

    // Сортируем данные
    const sortedRoundedKeys = tempRange.map(key => key.toString());
    const sortedRoundedValues = sortedRoundedKeys.map(key => roundedFrequencyHistogram[key] || 0);

    const chartHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Гистограммы</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body>
        <h1>Гистограммы</h1>

        <canvas id="tempHistogram" width="400" height="200"></canvas>
        <canvas id="cumulativeTempHistogram" width="400" height="200"></canvas>
        <canvas id="relativeTempHistogram" width="400" height="200"></canvas>
        <canvas id="cumulativeRelativeTempHistogram" width="400" height="200"></canvas>
        <canvas id="randomWalkHistogram" width="400" height="200"></canvas>

        <script>
            const ctx1 = document.getElementById('tempHistogram').getContext('2d');
            const ctx2 = document.getElementById('cumulativeTempHistogram').getContext('2d');
            const ctx3 = document.getElementById('relativeTempHistogram').getContext('2d');
            const ctx4 = document.getElementById('cumulativeRelativeTempHistogram').getContext('2d');
            const ctx5 = document.getElementById('randomWalkHistogram').getContext('2d');

            // Гистограмма температур
            const tempHistogramData = ${JSON.stringify(roundedFrequencyHistogram)};
            const sortedTempData = ${JSON.stringify(sortedRoundedValues)};

            new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: ${JSON.stringify(sortedRoundedKeys)},
                    datasets: [{
                        label: 'Гистограмма частот температур',
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

            // Кумулятивная гистограмма температур
            const cumulativeTempData = ${JSON.stringify(cumulativeFrequencyHistogram)};
            new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: Object.keys(cumulativeTempData).sort((a, b) => a - b),
                    datasets: [{
                        label: 'Кумулятивная гистограмма температур',
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
                                text: 'Кумулятивная частота'
                            }
                        }
                    }
                }
            });

            // Гистограмма относительной частоты температур
            const relativeTempData = ${JSON.stringify(relativeFrequencyHistogram)};
            new Chart(ctx3, {
                type: 'bar',
                data: {
                    labels: Object.keys(relativeTempData).sort((a, b) => a - b),
                    datasets: [{
                        label: 'Гистограмма относительной частоты температур',
                        data: Object.values(relativeTempData).sort((a, b) => a - b),
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 1 // Добавлено для границ между колонками
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
                                text: 'Относительная частота'
                            }
                        }
                    }
                }
            });

            // Кумулятивная гистограмма относительной частоты
            const cumulativeRelativeTempData = ${JSON.stringify(cumulativeRelativeFrequencyHistogram)};
            new Chart(ctx4, {
                type: 'line',
                data: {
                    labels: Object.keys(cumulativeRelativeTempData).sort((a, b) => a - b),
                    datasets: [{
                        label: 'Кумулятивная гистограмма относительной частоты температур',
                        data: Object.values(cumulativeRelativeTempData).sort((a, b) => a - b),
                        backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        borderColor: 'rgba(255, 206, 86, 1)',
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
                                text: 'Кумулятивная относительная частота'
                            }
                        }
                    }
                }
            });

            // Гистограмма случайного блуждания
            const randomWalkData = ${JSON.stringify(randomWalkValues)};
            const randomWalkHistogramData = {};
            randomWalkData.forEach(value => {
                randomWalkHistogramData[value] = (randomWalkHistogramData[value] || 0) + 1;
            });

            const sortedRandomWalkKeys = Object.keys(randomWalkHistogramData).sort((a, b) => a - b);
            const sortedRandomWalkValues = sortedRandomWalkKeys.map(key => randomWalkHistogramData[key]);

            new Chart(ctx5, {
                type: 'bar',
                data: {
                    labels: sortedRandomWalkKeys,
                    datasets: [{
                        label: 'Гистограмма случайного блуждания',
                        data: sortedRandomWalkValues,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Значение случайного блуждания'
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
        </script>
    </body>
    </html>
    `;

    fs.writeFileSync('./output/charts.html', chartHTML);
};
