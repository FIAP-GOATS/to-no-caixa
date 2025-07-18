import fetch from 'node-fetch';

export default class AIService {
constructor({
    apiKey,
    apiUrl
}) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
}

async getAssistantResponse({ systemPrompt, userPrompt }) {
    
    const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4.1-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]
        })
    });

    if (!response.ok) {
        throw new Error('Falha em processar resposta da IA');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

}