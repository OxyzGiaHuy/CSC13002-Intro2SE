import React, { useState } from 'react';
import { Map as MapIcon, Tent, Backpack } from 'lucide-react';
import type { ItineraryPlan, ChecklistItem } from '../types/index';
import { generateTrekkingPlan, refineTrekkingPlan } from '../../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { useTranslations } from '../data/i18n';

const Planner: React.FC = () => {
    const auth = useAuth();
    const lang = auth?.language || 'en';
    const T = useTranslations(lang);
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
                setError(T.common.error || 'Failed to generate plan.');
            }
        } catch (err: any) {
            setError(err.message || T.common.error);
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
            setError(T.common.error || 'Failed to refine plan. Please try again.');
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
        <div className="min-h-screen bg-gradient-to-br from-[#F0FDF4] via-white to-[#F0FDF4] pb-8">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#047857] mb-4">{T.planner.title}</h2>
                    <p className="text-[#0F172A]/60 text-lg">{T.home.subtitle}</p>
                </div>
                {error && (
                    <div className="mb-6 max-w-4xl mx-auto bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
                        <span className="block sm:inline text-sm font-medium">{error}</span>
                    </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Input Section */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border-2 border-[#F0FDF4] h-fit">
                        <h3 className="text-2xl font-bold text-[#047857] mb-6">{T.planner.createPlan}</h3>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-[#0F172A] mb-2">{T.planner.destination}</label>
                                <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-3 border-2 border-[#F0FDF4] rounded-lg focus:border-[#047857] focus:ring-2 focus:ring-[#DCFCE7] outline-none transition-all bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7]" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#0F172A] mb-2">{T.planner.dates}</label>
                                <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value) || 1)} min="1" className="w-full px-4 py-3 border-2 border-[#F0FDF4] rounded-lg focus:border-[#047857] focus:ring-2 focus:ring-[#DCFCE7] outline-none transition-all bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7]" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#0F172A] mb-2">{T.planner.difficulty}</label>
                                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full px-4 py-3 border-2 border-[#F0FDF4] rounded-lg focus:border-[#047857] focus:ring-2 focus:ring-[#DCFCE7] outline-none transition-all bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7]">
                                    <option>Easy</option>
                                    <option>Moderate</option>
                                    <option>Hard</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#0F172A] mb-2">{T.planner.activities}</label>
                                <textarea value={interests} onChange={e => setInterests(e.target.value)} rows={3} className="w-full px-4 py-3 border-2 border-[#F0FDF4] rounded-lg focus:border-[#047857] focus:ring-2 focus:ring-[#DCFCE7] outline-none transition-all bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] resize-none"></textarea>
                            </div>
                            <button onClick={handleGeneratePlan} disabled={isLoading} className="w-full bg-gradient-to-r from-[#047857] to-[#10B981] text-white py-3 rounded-lg hover:shadow-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide">
                                {isLoading ? `${T.common.loading}...` : T.planner.suggestions}
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        {/* Plan Display */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-[#F0FDF4]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-[#047857]">{T.planner.viewItinerary}</h3>
                                {plan && <span className="text-xs bg-[#DCFCE7] text-[#047857] px-3 py-1 rounded-full font-bold">✓ {T.common.success}</span>}
                            </div>

                            {isLoading && <div className="text-center py-12"><p className="text-[#0F172A]/60 animate-pulse font-medium">{T.common.loading}...</p></div>}

                            {!isLoading && !plan && !error && (
                                <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
                                    <div className="p-4 bg-[#F0FDF4] rounded-full">
                                        <MapIcon className="w-12 h-12 text-[#047857]" />
                                    </div>
                                    <div className="max-w-md space-y-2">
                                        <h4 className="text-xl font-bold text-[#0F172A]">{T.planner.ready || 'Ready to Plan?'}</h4>
                                        <p className="text-[#0F172A]/60">
                                            {T.planner.fillDetails || 'Fill in your preferences and let AI create a perfect itinerary.'}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 w-full max-w-sm pt-4">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-2 bg-[#DCFCE7] text-[#047857] rounded-lg"><MapIcon className="w-5 h-5" /></div>
                                            <span className="text-xs text-[#0F172A]/60 font-medium">{T.planner.day || 'Daily'}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-2 bg-[#DCFCE7] text-[#047857] rounded-lg"><Tent className="w-5 h-5" /></div>
                                            <span className="text-xs text-[#0F172A]/60 font-medium">{T.profile.camping || 'Camps'}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-2 bg-[#DCFCE7] text-[#047857] rounded-lg"><Backpack className="w-5 h-5" /></div>
                                            <span className="text-xs text-[#0F172A]/60 font-medium">{T.planner.meals || 'Pack'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {plan && (
                                <div className="space-y-6">
                                    {/* Refine Input (Top or Bottom? Let's put top for visibility) */}
                                    <div className="bg-[#F0FDF4] p-4 rounded-lg border-2 border-[#047857]/30 mb-6">
                                        <h4 className="font-bold text-sm text-[#047857] mb-3">{T.planner.editPlan || 'Want to adjust this plan?'}</h4>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder={T.planner.suggestions || 'Add suggestions...'}
                                                value={refineInstruction}
                                                onChange={(e) => setRefineInstruction(e.target.value)}
                                                className="flex-1 px-4 py-2 border-2 border-[#047857]/20 rounded-lg text-sm focus:border-[#047857] focus:ring-1 focus:ring-[#047857] outline-none transition-all"
                                            />
                                            <button
                                                onClick={handleRefinePlan}
                                                disabled={isRefining}
                                                className="bg-[#047857] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#10B981] font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {isRefining ? `${T.common.loading}...` : T.planner.editPlan}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {plan.plan.map(day => (
                                            <div key={day.day} className="border-2 border-[#F0FDF4] p-5 rounded-lg hover:shadow-lg transition-shadow hover:border-[#047857]/30">
                                                <h4 className="font-bold text-lg text-[#047857]">{T.planner.day} {day.day}: {day.title}</h4>
                                                <div className="flex gap-4 text-sm text-[#0F172A]/60 mt-2 mb-3">
                                                    <span>📍 {day.distance_km} {T.planner.km || 'km'}</span>
                                                    <span>🏕️ {day.camping_suggestion || T.planner.meals}</span>
                                                </div>
                                                <p className="text-[#0F172A] italic border-l-4 border-[#047857] pl-3 py-1 bg-[#F0FDF4]/30">{day.route}</p>

                                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h5 className="font-bold text-sm text-[#047857] mb-2">✨ {T.trailDetail.highlights || 'Highlights'}:</h5>
                                                        <ul className="space-y-1">
                                                            {day.highlights.map((h, i) => <li key={i} className="text-sm text-[#0F172A]/70 flex items-start gap-2"><span className="text-[#047857] font-bold mt-0.5">•</span> {h}</li>)}
                                                        </ul>
                                                    </div>
                                                    {day.smart_suggestions && day.smart_suggestions.length > 0 && (
                                                        <div>
                                                            <h5 className="font-bold text-sm text-[#047857] mb-2">💡 {T.common.tips || 'Tips'}:</h5>
                                                            <ul className="space-y-1">
                                                                {day.smart_suggestions.map((s, i) => (
                                                                    <li key={i} className="bg-[#F0FDF4] p-2 rounded text-sm text-[#0F172A]">
                                                                        <span className="font-bold text-xs uppercase tracking-wide text-[#047857]">{s.type}</span>: {s.name}
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
                            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-[#F0FDF4]">
                                <h3 className="text-2xl font-bold text-[#047857] mb-6">🎒 {T.planner.packing || 'Packing Checklist'}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {plan.checklist.map((itemText, index) => (
                                        <div key={index} className="flex items-start p-3 hover:bg-[#F0FDF4]/50 rounded-lg transition-colors">
                                            <input
                                                type="checkbox"
                                                id={`check-${index}`}
                                                checked={!!checkedItems[itemText]}
                                                onChange={() => toggleChecklistItem(itemText)}
                                                className="mt-1 h-4 w-4 rounded border-2 border-[#047857] text-[#047857] focus:ring-[#047857] cursor-pointer accent-[#047857]"
                                            />
                                            <label htmlFor={`check-${index}`} className={`ml-3 text-sm cursor-pointer ${checkedItems[itemText] ? 'line-through text-[#0F172A]/40' : 'text-[#0F172A]'}`}>
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
        </div>
    );
};

export default Planner;

