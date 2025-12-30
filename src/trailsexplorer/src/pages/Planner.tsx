import React, { useState } from 'react';
import type { ItineraryPlan, ChecklistItem } from '../types/index';
import { generateTrekkingPlan, generateChecklist } from '../../services/geminiService';

const Planner: React.FC = () => {
    const [location, setLocation] = useState('Tà Năng - Phan Dũng');
    const [duration, setDuration] = useState(3);
    const [difficulty, setDifficulty] = useState('Medium');
    const [interests, setInterests] = useState('beautiful grasslands, pine forests, and challenging climbs');
    const [plan, setPlan] = useState<ItineraryPlan | null>(null);
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [isLoadingPlan, setIsLoadingPlan] = useState(false);
    const [isLoadingChecklist, setIsLoadingChecklist] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePlan = async () => {
        setIsLoadingPlan(true);
        setError(null);
        setPlan(null);
        try {
            const result = await generateTrekkingPlan(location, duration, difficulty, interests);
            if (result) {
                setPlan(result);
            } else {
                setError('Failed to generate plan. Please check your API key configuration.');
            }
        } catch (err) {
            setError('Failed to generate plan. Please try again.');
            console.error(err);
        }
        setIsLoadingPlan(false);
    };
    
    const handleGenerateChecklist = async () => {
        setIsLoadingChecklist(true);
        setChecklist([]);
        setError(null);
        try {
            const result = await generateChecklist(location, duration, difficulty);
            if (result) {
                setChecklist(result.map((text, index) => ({ id: index, text, packed: false })));
            } else {
                setError('Failed to generate checklist. Please check your API key configuration.');
            }
        } catch (err) {
            setError('Failed to generate checklist. Please try again.');
            console.error(err);
        }
        setIsLoadingChecklist(false);
    };

    const toggleChecklistItem = (id: number) => {
        setChecklist(checklist.map(item => item.id === id ? { ...item, packed: !item.packed } : item));
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h2 className="text-3xl font-display text-forest-green mb-6 text-center">AI Trekking Planner</h2>
            {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold font-display text-forest-green mb-4">Plan Your Trip</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
                            <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value) || 1)} min="1" className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm">
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Interests</label>
                            <textarea value={interests} onChange={e => setInterests(e.target.value)} rows={3} className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm"></textarea>
                        </div>
                        <button onClick={handleGeneratePlan} disabled={isLoadingPlan} className="w-full bg-sage-green text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400">
                            {isLoadingPlan ? 'Generating Plan...' : 'Generate Plan'}
                        </button>
                        <button onClick={handleGenerateChecklist} disabled={isLoadingChecklist} className="w-full bg-earth-brown text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400">
                            {isLoadingChecklist ? 'Generating Checklist...' : 'Generate Checklist'}
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    {/* Plan Display */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold font-display text-forest-green mb-4">Your Itinerary</h3>
                        {isLoadingPlan && <p className="text-gray-500">Generating your personalized itinerary...</p>}
                        {!isLoadingPlan && !plan && !error && <p className="text-gray-500">Your generated plan will appear here.</p>}
                        {plan && (
                            <div className="space-y-4">
                                {plan.plan.map(day => (
                                    <div key={day.day} className="border border-gray-200 p-4 rounded-lg">
                                        <h4 className="font-bold text-lg text-sage-green">Day {day.day}: {day.title}</h4>
                                        <p className="text-sm font-semibold">{day.distance_km} km</p>
                                        <p className="mt-2 text-gray-700">{day.route}</p>
                                        <div className="mt-2">
                                            <h5 className="font-semibold">Highlights:</h5>
                                            <ul className="list-disc list-inside text-gray-600">
                                                {day.highlights.map((h, i) => <li key={i}>{h}</li>)}
                                            </ul>
                                        </div>
                                        {day.smart_suggestions && day.smart_suggestions.length > 0 && (
                                            <div className="mt-2">
                                                <h5 className="font-semibold">Smart Suggestions:</h5>
                                                <ul className="list-disc list-inside text-gray-600">
                                                    {day.smart_suggestions.map((s, i) => (
                                                        <li key={i}>
                                                            <span className="font-semibold">{s.name}</span> ({s.type}): {s.description}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {day.camping_suggestion && (
                                            <div className="mt-2">
                                                <h5 className="font-semibold">Camping Suggestion:</h5>
                                                <p className="text-gray-600">{day.camping_suggestion}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Checklist Display */}
                    {checklist.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold font-display text-forest-green mb-4">Packing Checklist</h3>
                            <div className="space-y-2">
                                {checklist.map(item => (
                                    <div key={item.id} className="flex items-center">
                                        <input type="checkbox" id={`item-${item.id}`} checked={item.packed} onChange={() => toggleChecklistItem(item.id)} className="h-4 w-4 rounded border-gray-300 text-sage-green focus:ring-sage-green"/>
                                        <label htmlFor={`item-${item.id}`} className={`ml-3 block text-sm text-gray-900 ${item.packed ? 'line-through text-gray-500' : ''}`}>{item.text}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Planner;

