import fs from 'fs';
import pkg from 'papaparse';
const { parse } = pkg;
import { calculateHistogram } from './histogram.js';
import { generateCharts } from './generateCharts.js'; // Імпорт функції для генерації графіків

// Читання даних з CSV файлу
const loadData = () => {
    const data = fs.readFileSync('./data/weather_data.csv', 'utf-8');
    return parse(data, { header: true }).data;
};

// Симуляція випадкового блукання
const simulateRandomWalk = (days) => {
    let values = [0]; // Початкова позиція

    for (let i = 1; i < days; i++) {
        const change = Math.random() < 0.5 ? -1 : 1; // Випадкова зміна (зростання або зниження)
        const newValue = values[i - 1] + change;
        values.push(newValue);
    }
    return values;
};

// Основна функція
const main = () => {
    const weatherData = loadData();

    // Конвертуємо дані в числові значення
    const temperatures = weatherData.map(row => parseFloat(row['Average Temperature (celsius)']));

    // Обчислюємо гістограми
    const {
        frequencyHistogram,
        cumulativeFrequencyHistogram,
        relativeFrequencyHistogram,
        cumulativeRelativeFrequencyHistogram
    } = calculateHistogram(temperatures);

    // Генеруємо гістограму для випадкового блукання
    const randomWalkValues = simulateRandomWalk(100); // Симуляція на 100 днів
    const { frequencyHistogramWalk } = calculateHistogram(randomWalkValues);

    // Запис результатів у файл
    const results = `
    Гістограма частот температур: ${JSON.stringify(frequencyHistogram)}
    Кумулятивна гістограма частот температур: ${JSON.stringify(cumulativeFrequencyHistogram)}
    Гістограма відносної частоти температур: ${JSON.stringify(relativeFrequencyHistogram)}
    Кумулятивна гістограма відносної частоти температур: ${JSON.stringify(cumulativeRelativeFrequencyHistogram)}
    Гістограма частот випадкового блукання: ${JSON.stringify(frequencyHistogramWalk)}
    `;
    fs.writeFileSync('./output/results.txt', results);

    // Генерація графіків
    generateCharts(temperatures, randomWalkValues, frequencyHistogram, cumulativeFrequencyHistogram, relativeFrequencyHistogram, cumulativeRelativeFrequencyHistogram);
};

main();
