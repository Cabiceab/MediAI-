// ICD-11 API Service (WHO International Classification of Diseases)
const ICD11_API_KEY = 'YOUR_API_KEY'; // Get from https://icd.who.int/icdapi

async function fetchICD11Entity(code) {
    try {
        const response = await fetch(`https://id.who.int/icd/entity/${code}`, {
            headers: {
                'API-Version': 'v2',
                'Accept-Language': 'en',
                'Authorization': `Bearer ${ICD11_API_KEY}`
            }
        });
        
        if (!response.ok) throw new Error('ICD-11 API Error');
        
        const data = await response.json();
        return {
            code: data.code,
            title: data.title,
            definition: data.definition,
            diagnosticCriteria: data.diagnosticCriteria,
            associatedSymptoms: data.associatedSymptoms
        };
        
    } catch (error) {
        console.error('ICD-11 Service Error:', error);
        return null;
    }
}

// Example usage: 
// const migraineData = await fetchICD11Entity('8A80.0');