import React from 'react';
import { Clock, CheckCircle, ShieldAlert } from 'lucide-react';

const UserDashboard = () => {
    return (
        <div className="container p-8 max-w-4xl mx-auto">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
                    <Clock size={40} />
                </div>
                
                <h1 className="text-4xl font-bold mb-4">Welcome to Binjwa Solution</h1>
                <p className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto">
                    Your account has been successfully created. For security reasons, a platform administrator must assign your role before you can access specific investment or company data.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
                    <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                        <CheckCircle className="text-green-500 mb-3" />
                        <h3 className="font-semibold mb-1">Registration</h3>
                        <p className="text-sm text-gray-400">Account verified and ready.</p>
                    </div>
                    <div className="p-6 bg-blue-500/10 rounded-xl border-blue-500/20">
                        <Clock className="text-blue-500 mb-3 animate-pulse" />
                        <h3 className="font-semibold mb-1 text-blue-400 text-sm">Role Pending</h3>
                        <p className="text-sm text-gray-400">Admin is reviewing your profile.</p>
                    </div>
                    <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 opacity-50">
                        <ShieldAlert className="text-gray-500 mb-3" />
                        <h3 className="font-semibold mb-1">Dashboard Access</h3>
                        <p className="text-sm text-gray-400">Full access unlocks after approval.</p>
                    </div>
                </div>

                <div className="text-gray-500 text-sm">
                    Need urgent access? Contact support@binjwa.com
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
