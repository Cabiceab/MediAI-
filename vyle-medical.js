const medicalDatabase = {
    "MG": {
        code: "8A80.0",
        name: "Migraine",
        symptoms: ["Unilateral headache", "Photophobia", "Nausea"],
        diagnostic: {
            criteria: "At least 5 attacks lasting 4-72 hours",
            images: []
        },
        treatment: {
            acute: ["Triptans", "NSAIDs"],
            preventive: ["Topiramate", "Propranolol"]
        }
    },
    "PN": {
        code: "CA40.0",
        name: "Pneumonia",
        symptoms: ["Cough", "Fever", "Chest pain"],
        diagnostic: {
            criteria: "Chest X-ray showing consolidation",
            images: ["https://example.com/pneumonia-xray.jpg"]
        },
        treatment: {
            firstLine: "Amoxicillin 500mg TDS",
            alternatives: ["Doxycycline", "Levofloxacin"]
        }
    }
};

async function getDifferentialDiagnosis(symptoms) {
    return Object.values(medicalDatabase).filter(disease => 
        disease.symptoms.some(symptom => 
            symptoms.some(input => input.toLowerCase().includes(symptom.toLowerCase()))
        )
    );
}