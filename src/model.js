import { calculateHistogram } from './histogram.js';
import { generateCharts } from './generateCharts.js';
import fs from 'fs';
import * as ss from 'simple-statistics'; // Імпорт бібліотеки simple-statistics

// Зчитування даних з файлу weather_data.csv
const readWeatherData = (filePath) => {
    const data = fs.readFileSync(filePath, 'utf-8');
    const rows = data.split('\n').slice(1);
    const temperatures = [];

    rows.forEach(row => {
        const columns = row.split(',');
        const averageTemperature = parseFloat(columns[3]); // Стовпець зі середньою температурою
        if (!isNaN(averageTemperature)) {
            temperatures.push(averageTemperature);
        }
    });

    return temperatures;
};

// Зчитування даних
const temperatures = readWeatherData('./data/weather_data.csv');

// Дескриптивний аналіз з використанням simple-statistics
const average = ss.mean(temperatures);
const median = ss.median(temperatures);
const stdDev = ss.standardDeviation(temperatures);
const minValue = ss.min(temperatures);
const maxValue = ss.max(temperatures);
const mode = ss.mode(temperatures);
const variance = ss.variance(temperatures);
const rangeValue = maxValue - minValue;

// Формування рядка результатів
const results = `
Середнє: ${average}
Медіана: ${median}
Стандартне відхилення: ${stdDev}
Мінімум: ${minValue}
Максимум: ${maxValue}
Мода: ${mode}
Дисперсія: ${variance}
Розмах: ${rangeValue}
`;

// Запис результатів у файл results.txt
fs.writeFileSync('./output/results.txt', results);

// Розрахунок гістограми
const { frequencyHistogram, cumulativeFrequencyHistogram, relativeFrequencyHistogram, cumulativeRelativeFrequencyHistogram } = calculateHistogram(temperatures);

// Генерація графіків
generateCharts(temperatures, [], frequencyHistogram, cumulativeFrequencyHistogram, relativeFrequencyHistogram, cumulativeRelativeFrequencyHistogram);
