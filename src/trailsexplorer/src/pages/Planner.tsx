import React, { useState, useEffect } from 'react';
import { Map as MapIcon, Tent, Backpack } from 'lucide-react';
import type { ItineraryPlan, ChecklistItem } from '../types/index';
import { generateTrekkingPlan, refineTrekkingPlan, generateChecklist } from '../../services/geminiService';

const Planner: React.FC = () => {
    const [location, setLocation] = useState('Tà Năng - Phan Dũng');
    const [duration, setDuration] = useState(3);
    const [difficulty, setDifficulty] = useState('Moderate');
    const [interests, setInterests] = useState('beautiful grasslands, pine forests, and challenging climbs');

    // Unified Plan State (includes checklist)
    const [plan, setPlan] = useState<ItineraryPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    // Refine State
    const [refineInstruction, setRefineInstruction] = useState('');
    const [isRefining, setIsRefining] = useState(false);

    // Checklist State
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [isLoadingChecklist, setIsLoadingChecklist] = useState(false);

    const handleGeneratePlan = async () => {
        const fieldErrors = validate();
        if (Object.keys(fieldErrors).length > 0) {
            setError('Please fix the highlighted validation errors.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setPlan(null);
        try {
            const result = await generateTrekkingPlan(location, duration, difficulty, interests);
            if (result) {
                setPlan(result);
                setToast('Plan generated successfully');
            } else {
                setError('Failed to generate plan.');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to generate plan. Please try again.');
            console.error(err);
        }
        setIsLoading(false);
    };
    
    const handleGenerateChecklist = async () => {
        const fieldErrors = validate();
        if (Object.keys(fieldErrors).length > 0) {
            setError('Please fix the highlighted validation errors.');
            return;
        }

        setIsLoadingChecklist(true);
        setChecklist([]);
        setError(null);
        try {
            const result = await generateChecklist(location, duration, difficulty);
            if (result) {
                setChecklist(result.map((text, index) => ({ id: index, text, packed: false })));
                setToast('Checklist generated successfully');
            } else {
                setError('Failed to generate checklist. Please check your API key configuration.');
            }
        } catch (err) {
            setError('Failed to generate checklist. Please try again.');
            console.error(err);
        }
        setIsLoadingChecklist(false);
    };

    const handleRefinePlan = async () => {
        if (!plan || !plan.id) {
            setError('No plan available to refine.');
            return;
        }
        if (!refineInstruction || !refineInstruction.trim()) {
            setError('Please enter refine instructions.');
            return;
        }
        setIsRefining(true);
        try {
            const updated = await refineTrekkingPlan(plan.id as number, refineInstruction);
            if (updated) {
                setPlan(updated);
                setToast('Plan refined successfully');
                setRefineInstruction('');
            } else {
                setError('Failed to refine plan.');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to refine plan.');
            console.error(err);
        }
        setIsRefining(false);
    };

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 3500);
        return () => clearTimeout(t);
    }, [toast]);

    const validate = (): Record<string, string> => {
        const errs: Record<string, string> = {};
        if (!location || !location.trim()) errs.location = 'Location is required.';
        if (!Number.isFinite(duration) || duration <= 0 || duration > 30) errs.duration = 'Duration must be a number between 1 and 30 days.';
        if (!['Easy', 'Moderate', 'Hard'].includes(difficulty)) errs.difficulty = 'Please select a valid difficulty.';
        return errs;
    };

    const fieldErrors = validate();
    const isFormValid = Object.keys(fieldErrors).length === 0;

    const toggleChecklistItem = (id: number) => {
        setChecklist(prev => prev.map(item => item.id === id ? { ...item, packed: !item.packed } : item));
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
                            {fieldErrors.location && <p className="text-sm text-red-600 mt-1">{fieldErrors.location}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
                            <input
                                type="number"
                                value={Number.isFinite(duration) ? duration : ''}
                                onChange={e => setDuration(e.target.value === '' ? NaN : Number(e.target.value))}
                                min="1"
                                max="30"
                                className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm"
                            />
                            {fieldErrors.duration && <p className="text-sm text-red-600 mt-1">{fieldErrors.duration}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm">
                                <option>Easy</option>
                                <option>Moderate</option>
                                <option>Hard</option>
                            </select>
                            {fieldErrors.difficulty && <p className="text-sm text-red-600 mt-1">{fieldErrors.difficulty}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Interests</label>
                            <textarea value={interests} onChange={e => setInterests(e.target.value)} rows={3} className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm"></textarea>
                        </div>
                        <button onClick={handleGeneratePlan} disabled={isLoading || !isFormValid} className="w-full bg-sage-green text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400">
                            {isLoading ? 'Generating Plan...' : 'Generate Plan'}
                        </button>
                        <button onClick={handleGenerateChecklist} disabled={isLoadingChecklist || !isFormValid} className="w-full bg-earth-brown text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400">
                            {isLoadingChecklist ? 'Generating Checklist...' : 'Generate Checklist'}
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

                        {!isLoading && !plan && !error && (
                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                                <div className="p-4 bg-green-50 rounded-full">
                                    <MapIcon className="w-12 h-12 text-forest-green" />
                                </div>
                                <div className="max-w-md space-y-2">
                                    <h4 className="text-xl font-bold text-gray-900">Ready to Plan Your Adventure?</h4>
                                    <p className="text-gray-500">
                                        Fill in the details on the left, and our AI will generate a personalized day-by-day itinerary and packing checklist just for you.
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-4 w-full max-w-sm pt-4">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MapIcon className="w-5 h-5" /></div>
                                        <span className="text-xs text-gray-500 font-medium">Daily Route</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Tent className="w-5 h-5" /></div>
                                        <span className="text-xs text-gray-500 font-medium">Campsites</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Backpack className="w-5 h-5" /></div>
                                        <span className="text-xs text-gray-500 font-medium">Pack List</span>
                                    </div>
                                </div>
                            </div>
                        )}

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

                    {/* Toast */}
                    {toast && (
                        <div className="fixed right-6 top-6 z-50">
                            <div className="bg-green-600 text-white px-4 py-2 rounded shadow-lg">{toast}</div>
                        </div>
                    )}
                    {/* Checklist Display */}
                    {checklist.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold font-display text-forest-green mb-4">🎒 Smart Packing Checklist</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {checklist.map(item => (
                                    <div key={item.id} className="flex items-start p-2 hover:bg-gray-50 rounded">
                                        <input
                                            type="checkbox"
                                            id={`check-${item.id}`}
                                            checked={item.packed}
                                            onChange={() => toggleChecklistItem(item.id)}
                                            className="mt-1 h-4 w-4 rounded border-gray-300 text-sage-green focus:ring-sage-green cursor-pointer"
                                        />
                                        <label htmlFor={`check-${item.id}`} className={`ml-3 text-sm text-gray-900 cursor-pointer ${item.packed ? 'line-through text-gray-400' : ''}`}>
                                            {item.text}
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

