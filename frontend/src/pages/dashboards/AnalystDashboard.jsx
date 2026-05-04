import React from 'react';
import { Database, Filter, Download, Activity } from 'lucide-react';

const AnalystDashboard = () => {
    return (
        <div className="container p-8">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2"><Database className="text-yellow-500"/> Analyst Dashboard</h1>
            
            <div className="glass p-6 rounded-xl mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2"><Filter size={20} /> Startup Data Filters</h2>
                    <button className="flex items-center gap-2 text-sm bg-gray-800 px-3 py-2 rounded hover:bg-gray-700 transition">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
                <div className="flex gap-4">
                    <select className="bg-gray-800 border border-gray-700 rounded p-2 text-sm flex-1 text-white">
                        <option>All Sectors</option>
                        <option>Fintech</option>
                        <option>HealthTech</option>
                        <option>AI/ML</option>
                    </select>
                    <select className="bg-gray-800 border border-gray-700 rounded p-2 text-sm flex-1 text-white">
                        <option>All Stages</option>
                        <option>Pre-seed</option>
                        <option>Seed</option>
                        <option>Series A</option>
                    </select>
                    <select className="bg-gray-800 border border-gray-700 rounded p-2 text-sm flex-1 text-white">
                        <option>Any Revenue</option>
                        <option>Pre-revenue</option>
                        <option>$0 - $1M</option>
                        <option>$1M+</option>
                    </select>
                </div>
            </div>

            <div className="glass p-0 rounded-xl overflow-hidden mb-6">
                <table className="w-full text-left">
                    <thead className="bg-gray-800/50">
                        <tr className="text-gray-400">
                            <th className="p-4 font-medium">Startup Name</th>
                            <th className="p-4 font-medium">Sector</th>
                            <th className="p-4 font-medium">Stage</th>
                            <th className="p-4 font-medium">Valuation</th>
                            <th className="p-4 font-medium">Risk Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        <tr className="hover:bg-gray-800/30 transition">
                            <td className="p-4 font-medium text-white">FinServe AI</td>
                            <td className="p-4">Fintech</td>
                            <td className="p-4">Seed</td>
                            <td className="p-4">$15M</td>
                            <td className="p-4"><span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Low (3.2)</span></td>
                        </tr>
                        <tr className="hover:bg-gray-800/30 transition">
                            <td className="p-4 font-medium text-white">HealthGenics</td>
                            <td className="p-4">HealthTech</td>
                            <td className="p-4">Series A</td>
                            <td className="p-4">$45M</td>
                            <td className="p-4"><span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">Med (5.5)</span></td>
                        </tr>
                        <tr className="hover:bg-gray-800/30 transition">
                            <td className="p-4 font-medium text-white">Quantum Data</td>
                            <td className="p-4">AI/ML</td>
                            <td className="p-4">Pre-seed</td>
                            <td className="p-4">$4M</td>
                            <td className="p-4"><span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">High (8.1)</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="glass p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Activity size={20} /> Startup Comparison Tool</h2>
                <div className="h-48 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center text-gray-500">
                    Select startups from the table above to compare metrics
                </div>
            </div>
        </div>
    );
};
export default AnalystDashboard;
