export const calculateHistogram = (data) => {
    const frequencyHistogram = {};
    const totalDataPoints = data.length;

    // Розрахунок гістограми частот
    data.forEach(value => {
        if (frequencyHistogram[value]) {
            frequencyHistogram[value]++;
        } else {
            frequencyHistogram[value] = 1;
        }
    });

    // Обчислення кумулятивної гістограми частот
    const cumulativeFrequencyHistogram = {};
    let cumulativeSum = 0;
    for (const [value, count] of Object.entries(frequencyHistogram)) {
        cumulativeSum += count;
        cumulativeFrequencyHistogram[value] = cumulativeSum;
    }

    // Розрахунок гістограми відносної частоти
    const relativeFrequencyHistogram = {};
    for (const [value, count] of Object.entries(frequencyHistogram)) {
        relativeFrequencyHistogram[value] = count / totalDataPoints;
    }

    // Обчислення кумулятивної гістограми відносної частоти
    const cumulativeRelativeFrequencyHistogram = {};
    cumulativeSum = 0;
    for (const [value, relativeCount] of Object.entries(relativeFrequencyHistogram)) {
        cumulativeSum += relativeCount;
        cumulativeRelativeFrequencyHistogram[value] = cumulativeSum;
    }

    return {
        frequencyHistogram,
        cumulativeFrequencyHistogram,
        relativeFrequencyHistogram,
        cumulativeRelativeFrequencyHistogram
    };
};
