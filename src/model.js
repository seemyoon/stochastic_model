import { calculateHistogram } from './histogram.js';
import { generateCharts } from './generateCharts.js';
import fs from 'fs';

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

// Дескриптивний аналіз
const average = temperatures.reduce((sum, val) => sum + val, 0) / temperatures.length;

const median = (() => {
    const sorted = [...temperatures].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
})();

const stdDev = Math.sqrt(temperatures.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / temperatures.length);

const minValue = Math.min(...temperatures);
const maxValue = Math.max(...temperatures);
const mode = temperatures.sort((a, b) =>
    temperatures.filter(v => v === a).length - temperatures.filter(v => v === b).length
).pop();

const variance = temperatures.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / temperatures.length;
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
