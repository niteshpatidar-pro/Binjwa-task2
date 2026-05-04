import React from 'react';
import { Target, Building, Users, FileText } from 'lucide-react';

const FounderDashboard = () => {
    return (
        <div className="container p-8">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2"><Building className="text-purple-500"/> Founder Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass p-6 rounded-xl border-t-4 border-purple-500">
                    <h3 className="font-semibold flex items-center gap-2"><Target /> Funding Goal</h3>
                    <p className="text-3xl mt-2">$500k <span className="text-sm text-gray-400">/ $1M</span></p>
                    <div className="w-full bg-gray-700 h-2 mt-3 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full" style={{ width: '50%' }}></div>
                    </div>
                </div>
                <div className="glass p-6 rounded-xl">
                    <h3 className="font-semibold flex items-center gap-2"><Users /> Investor Interest</h3>
                    <p className="text-3xl mt-2">24</p>
                    <p className="text-sm text-green-400 mt-1">+3 this week</p>
                </div>
                <div className="glass p-6 rounded-xl">
                    <h3 className="font-semibold flex items-center gap-2"><FileText /> Pitch Views</h3>
                    <p className="text-3xl mt-2">156</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">Milestone Tracker</h2>
                    <div className="space-y-4 relative border-l-2 border-gray-700 ml-3 pl-6">
                        <div className="relative">
                            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[31px] top-1"></div>
                            <h4 className="font-medium text-white">MVP Launch</h4>
                            <p className="text-sm text-gray-400">Completed Q3 2023</p>
                        </div>
                        <div className="relative">
                            <div className="absolute w-4 h-4 bg-purple-500 rounded-full -left-[31px] top-1"></div>
                            <h4 className="font-medium text-white">Seed Funding Round</h4>
                            <p className="text-sm text-gray-400">In Progress</p>
                        </div>
                        <div className="relative">
                            <div className="absolute w-4 h-4 bg-gray-600 rounded-full -left-[31px] top-1"></div>
                            <h4 className="font-medium text-white">Series A Preparation</h4>
                            <p className="text-sm text-gray-400">Planned Q2 2024</p>
                        </div>
                    </div>
                </div>
                <div className="glass p-6 rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">Company Profile Editor</h2>
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Company Name</label>
                            <input type="text" className="w-full bg-gray-800 border border-gray-700 p-2 rounded text-white" defaultValue="My Startup" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Elevator Pitch</label>
                            <textarea className="w-full bg-gray-800 border border-gray-700 p-2 rounded text-white h-24" defaultValue="Revolutionizing the AI space..."></textarea>
                        </div>
                        <button className="btn btn-primary w-full">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default FounderDashboard;
