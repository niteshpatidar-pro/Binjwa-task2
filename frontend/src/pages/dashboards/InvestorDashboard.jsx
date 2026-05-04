import React from 'react';
import { Briefcase, TrendingUp, Eye, LayoutDashboard } from 'lucide-react';

const InvestorDashboard = () => {
    return (
        <div className="container p-8">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2"><TrendingUp className="text-green-500"/> Investor Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="glass p-6 rounded-xl border-t-4 border-green-500">
                    <h3 className="text-gray-400 text-sm">Portfolio Value</h3>
                    <p className="text-2xl font-bold mt-1">$2.4M</p>
                </div>
                <div className="glass p-6 rounded-xl border-t-4 border-blue-500">
                    <h3 className="text-gray-400 text-sm">Active Deals</h3>
                    <p className="text-2xl font-bold mt-1">12</p>
                </div>
                <div className="glass p-6 rounded-xl border-t-4 border-purple-500">
                    <h3 className="text-gray-400 text-sm">Expected ROI</h3>
                    <p className="text-2xl font-bold mt-1">18.5%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-xl lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><LayoutDashboard /> Deal Flow Pipeline</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        <div className="min-w-[250px] bg-gray-800/50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-400 mb-3">Screening</h4>
                            <div className="bg-gray-700 p-3 rounded mb-2">TechCorp Series A</div>
                            <div className="bg-gray-700 p-3 rounded">HealthAI Seed</div>
                        </div>
                        <div className="min-w-[250px] bg-gray-800/50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-400 mb-3">Due Diligence</h4>
                            <div className="bg-gray-700 p-3 rounded">Fintech Solutions</div>
                        </div>
                    </div>
                </div>
                <div className="glass p-6 rounded-xl">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Eye /> Watchlist</h2>
                    <div className="space-y-3">
                        <div className="p-3 border border-gray-700 rounded flex justify-between">
                            <span>Quantum AI</span>
                            <span className="text-green-400">+5%</span>
                        </div>
                        <div className="p-3 border border-gray-700 rounded flex justify-between">
                            <span>EcoEnergy</span>
                            <span className="text-yellow-400">Stable</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default InvestorDashboard;
