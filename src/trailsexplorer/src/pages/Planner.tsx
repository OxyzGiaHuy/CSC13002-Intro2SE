import React, { useState } from 'react';
import type { ItineraryPlan, ChecklistItem } from '../types/index';
import { generateTrekkingPlan, refineTrekkingPlan } from '../../services/geminiService';

const Planner: React.FC = () => {
    const [location, setLocation] = useState('Tà Năng - Phan Dũng');
    const [duration, setDuration] = useState(3);
    const [difficulty, setDifficulty] = useState('Moderate');
    const [interests, setInterests] = useState('beautiful grasslands, pine forests, and challenging climbs');

    // Unified Plan State (includes checklist)
    const [plan, setPlan] = useState<ItineraryPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Refine State
    const [refineInstruction, setRefineInstruction] = useState('');
    const [isRefining, setIsRefining] = useState(false);

    const handleGeneratePlan = async () => {
        setIsLoading(true);
        setError(null);
        setPlan(null);
        try {
            const result = await generateTrekkingPlan(location, duration, difficulty, interests);
            if (result) {
                setPlan(result);
            } else {
                setError('Failed to generate plan.');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to generate plan. Please try again.');
            console.error(err);
        }
        setIsLoading(false);
    };

    const handleRefinePlan = async () => {
        if (!plan?.id || !refineInstruction.trim()) return;

        setIsRefining(true);
        setError(null);
        try {
            const result = await refineTrekkingPlan(plan.id, refineInstruction);
            if (result) {
                setPlan(result);
                setRefineInstruction(''); // Clear input on success
            }
        } catch (err: any) {
            setError('Failed to refine plan. Please try again.');
            console.error(err);
        }
        setIsRefining(false);
    };

    // Helper to toggle checklist item (local state management for mapped checklist)
    // Note: This only affects local view, ideally should update backend if tracking progress
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const toggleChecklistItem = (text: string) => {
        setCheckedItems(prev => ({
            ...prev,
            [text]: !prev[text]
        }));
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
                {/* Input Section */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg h-fit">
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
                                <option>Moderate</option>
                                <option>Hard</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Interests</label>
                            <textarea value={interests} onChange={e => setInterests(e.target.value)} rows={3} className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm"></textarea>
                        </div>
                        <button onClick={handleGeneratePlan} disabled={isLoading} className="w-full bg-sage-green text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400">
                            {isLoading ? 'Generating Plan & Checklist...' : 'Generate Plan'}
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    {/* Plan Display */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold font-display text-forest-green">Your Itinerary</h3>
                            {plan && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Auto-Saved</span>}
                        </div>

                        {isLoading && <div className="text-center py-8"><p className="text-gray-500 animate-pulse">Designing your perfect adventure...</p></div>}

                        {!isLoading && !plan && !error && <p className="text-gray-500">Your generated plan will appear here.</p>}

                        {plan && (
                            <div className="space-y-6">
                                {/* Refine Input (Top or Bottom? Let's put top for visibility) */}
                                <div className="bg-green-50 p-4 rounded-md border border-green-100 mb-6">
                                    <h4 className="font-semibold text-sm text-forest-green mb-2">Want to adjust this plan?</h4>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Ex: Add a rest day, avoid camping, focus on photography..."
                                            value={refineInstruction}
                                            onChange={(e) => setRefineInstruction(e.target.value)}
                                            className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                                        />
                                        <button
                                            onClick={handleRefinePlan}
                                            disabled={isRefining}
                                            className="bg-forest-green text-white px-4 py-2 rounded-md text-sm hover:bg-opacity-90 disabled:bg-gray-400"
                                        >
                                            {isRefining ? 'Refining...' : 'Refine'}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {plan.plan.map(day => (
                                        <div key={day.day} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                                            <h4 className="font-bold text-lg text-sage-green">Day {day.day}: {day.title}</h4>
                                            <div className="flex gap-4 text-sm text-gray-600 mt-1 mb-2">
                                                <span>📍 {day.distance_km} km</span>
                                                <span>🏕️ {day.camping_suggestion || 'No specific campsite'}</span>
                                            </div>
                                            <p className="text-gray-700 italic border-l-4 border-sage-green pl-2">{day.route}</p>

                                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                                                <div>
                                                    <h5 className="font-semibold text-sm">✨ Highlights:</h5>
                                                    <ul className="list-disc list-inside text-sm text-gray-600 ml-1">
                                                        {day.highlights.map((h, i) => <li key={i}>{h}</li>)}
                                                    </ul>
                                                </div>
                                                {day.smart_suggestions && day.smart_suggestions.length > 0 && (
                                                    <div>
                                                        <h5 className="font-semibold text-sm">💡 Smart Suggestions:</h5>
                                                        <ul className="list-none text-sm text-gray-600 space-y-1">
                                                            {day.smart_suggestions.map((s, i) => (
                                                                <li key={i} className="bg-gray-50 p-1 rounded">
                                                                    <span className="font-semibold text-xs uppercase tracking-wide text-earth-brown">{s.type}</span>: {s.name}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Integrated Checklist Display */}
                    {plan && plan.checklist && (
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold font-display text-forest-green mb-4">🎒 Smart Packing Checklist</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {plan.checklist.map((itemText, index) => (
                                    <div key={index} className="flex items-start p-2 hover:bg-gray-50 rounded">
                                        <input
                                            type="checkbox"
                                            id={`check-${index}`}
                                            checked={!!checkedItems[itemText]}
                                            onChange={() => toggleChecklistItem(itemText)}
                                            className="mt-1 h-4 w-4 rounded border-gray-300 text-sage-green focus:ring-sage-green cursor-pointer"
                                        />
                                        <label htmlFor={`check-${index}`} className={`ml-3 text-sm text-gray-900 cursor-pointer ${checkedItems[itemText] ? 'line-through text-gray-400' : ''}`}>
                                            {itemText}
                                        </label>
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

