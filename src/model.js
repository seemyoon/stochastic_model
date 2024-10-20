import { calculateHistogram } from './histogram.js';
import { generateCharts } from './generateCharts.js';
import fs from 'fs';
import * as ss from 'simple-statistics';

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

// Виведення результатів дескриптивного аналізу
console.log(`Середнє: ${average}`);
console.log(`Медіана: ${median}`);
console.log(`Стандартне відхилення: ${stdDev}`);
console.log(`Мінімум: ${minValue}`);
console.log(`Максимум: ${maxValue}`);
console.log(`Мода: ${mode}`);
console.log(`Дисперсія: ${variance}`);
console.log(`Розмах: ${rangeValue}`);

// Розрахунок гістограми
const { frequencyHistogram, cumulativeFrequencyHistogram, relativeFrequencyHistogram, cumulativeRelativeFrequencyHistogram } = calculateHistogram(temperatures);

// Генерація графіків
generateCharts(temperatures, [], frequencyHistogram, cumulativeFrequencyHistogram, relativeFrequencyHistogram, cumulativeRelativeFrequencyHistogram);
