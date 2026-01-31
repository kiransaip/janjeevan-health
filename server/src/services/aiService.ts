import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

interface SymptomAnalysis {
    severity: 'MINOR' | 'SEVERE';
    recommendations: string[];
    urgency: 'LOW' | 'MEDIUM' | 'HIGH';
    suggestedMedications?: string[];
    requiresDoctorConsultation: boolean;
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Mock logic for fallback
const mockAnalyze = (symptoms: string): SymptomAnalysis => {
    const symptomsLower = symptoms.toLowerCase();
    const severeKeywords = ['chest pain', 'difficulty breathing', 'unconscious', 'stroke', 'heart attack'];
    if (severeKeywords.some(k => symptomsLower.includes(k))) {
        return {
            severity: 'SEVERE',
            urgency: 'HIGH',
            recommendations: ['Immediate medical attention required', 'Call emergency services'],
            requiresDoctorConsultation: true
        };
    }
    return {
        severity: 'MINOR',
        urgency: 'MEDIUM',
        recommendations: ['Monitor symptoms', 'Rest and hydrate'],
        suggestedMedications: ['Paracetamol (if fever)'],
        requiresDoctorConsultation: false
    };
};

export const analyzeSymptoms = async (symptoms: string): Promise<SymptomAnalysis> => {
    if (!process.env.GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY not found, using fallback logic.');
        return mockAnalyze(symptoms);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
            Act as a medical AI assistant. Analyze these symptoms: "${symptoms}".
            Return a JSON object ONLY with this structure:
            {
                "severity": "MINOR" | "SEVERE",
                "urgency": "LOW" | "MEDIUM" | "HIGH",
                "recommendations": ["string"],
                "suggestedMedications": ["string"],
                "requiresDoctorConsultation": boolean
            }
            Do not include markdown formatting (like \`\`\`json). Just the raw JSON string.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim().replace(/```json/g, '').replace(/```/g, '');

        return JSON.parse(text) as SymptomAnalysis;
    } catch (error) {
        console.error('Gemini API Error:', error);
        return mockAnalyze(symptoms);
    }
};

export const analyzeSymptomAPI = async (req: Request, res: Response) => {
    try {
        const { symptoms } = req.body;
        if (!symptoms) return res.status(400).json({ error: 'Symptoms are required' });

        const analysis = await analyzeSymptoms(symptoms);
        res.json(analysis);
    } catch (error) {
        console.error('Analysis failed:', error);
        res.status(500).json({ error: 'Analysis failed' });
    }
};
