// Symptom-Condition Probability Matrix
const symptomMatrix = {
    'headache': {
        conditions: [
            { code: '8A80.0', name: 'Migraine', probability: 0.35 },
            { code: '8A81.0', name: 'Tension-type headache', probability: 0.25 },
            { code: '8A82.0', name: 'Cluster headache', probability: 0.15 }
        ],
        redFlags: [
            'Thunderclap onset',
            'Fever with neck stiffness',
            'Neurological deficits'
        ]
    },
    'fever': {
        conditions: [
            { code: '1C1Z', name: 'Influenza', probability: 0.30 },
            { code: '1F1Z', name: 'Pneumonia', probability: 0.25 },
            { code: '1A40', name: 'Urinary tract infection', probability: 0.20 }
        ],
        redFlags: [
            'Fever >40°C (104°F)',
            'Fever lasting >7 days',
            'Immune compromise'
        ]
    },
    'cough': {
        conditions: [
            { code: 'CA40.0', name: 'Pneumonia', probability: 0.30 },
            { code: 'CA07.0', name: 'Bronchitis', probability: 0.25 },
            { code: '1C25', name: 'COVID-19', probability: 0.20 }
        ],
        redFlags: [
            'Hemoptysis (coughing blood)',
            'Shortness of breath at rest',
            'Weight loss'
        ]
    }
};

// Get differential diagnosis based on symptoms
function getDifferentialDiagnosis(symptoms) {
    const conditionMap = new Map();
    
    symptoms.forEach(symptom => {
        const cleanSymptom = symptom.trim().toLowerCase();
        if (symptomMatrix[cleanSymptom]) {
            symptomMatrix[cleanSymptom].conditions.forEach(condition => {
                const current = conditionMap.get(condition.code) || 0;
                conditionMap.set(condition.code, current + condition.probability);
            });
        }
    });

    return Array.from(conditionMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([code, score]) => ({ code, score }));
}

// Example usage:
// const differentials = getDifferentialDiagnosis(['headache', 'fever']);