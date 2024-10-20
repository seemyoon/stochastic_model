import fs from 'fs';
import pkg from 'papaparse';
const { parse } = pkg;
import { calculateHistogram, simulateRandomWalk } from './histogram.js';
import { generateCharts } from './generateCharts.js';

// Читання даних з CSV файлу
const loadData = () => {
    const data = fs.readFileSync('./data/weather_data.csv', 'utf-8');
    return parse(data, { header: true }).data;
};

// Основна функція
const main = () => {
    const weatherData = loadData();

    // Конвертуємо дані в числові значення
    const temperatures = weatherData.map(row => parseFloat(row['Average Temperature (celsius)']));

    // Обчислюємо гістограми
    const { frequencyHistogram, cumulativeFrequencyHistogram, relativeFrequencyHistogram, cumulativeRelativeFrequencyHistogram } = calculateHistogram(temperatures);

    // Симуляція випадкового блукання температури
    const randomWalkValues = simulateRandomWalk(temperatures);

    // Генеруємо діаграми
    generateCharts(temperatures, randomWalkValues, frequencyHistogram, cumulativeFrequencyHistogram, relativeFrequencyHistogram, cumulativeRelativeFrequencyHistogram);

    // Запис результатів у файл
    const results = `
    Гістограма частот: ${JSON.stringify(frequencyHistogram)}
    Кумулятивна гістограма частот: ${JSON.stringify(cumulativeFrequencyHistogram)}
    Гістограма відносної частоти: ${JSON.stringify(relativeFrequencyHistogram)}
    Кумулятивна гістограма відносної частоти: ${JSON.stringify(cumulativeRelativeFrequencyHistogram)}
    `;
    fs.writeFileSync('./output/results.txt', results);
};

main();
