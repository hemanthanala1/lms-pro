import React, { useState } from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'settings'>('overview');
  
  const userGrowthData = [
    { name: 'Jan', users: 1200 },
    { name: 'Feb', users: 1900 },
    { name: 'Mar', users: 2400 },
    { name: 'Apr', users: 2800 },
    { name: 'May', users: 3500 },
    { name: 'Jun', users: 4200 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
         <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Admin Console</h1>
            <p className="text-gray-500 mt-1">Platform overview and user management.</p>
         </div>
         <div className="flex gap-2">
            <button onClick={() => setActiveTab('settings')} className="bg-white border border-gray-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50">Settings</button>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800">Export Reports</button>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl w-fit mb-8">
         {['overview', 'users', 'settings'].map(tab => (
            <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`px-6 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  activeTab === tab 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
               }`}
            >
               {tab}
            </button>
         ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
         <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Users</h3>
                  <div className="mt-2 text-3xl font-bold text-slate-900">12,450</div>
               </div>
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Active Instructors</h3>
                  <div className="mt-2 text-3xl font-bold text-slate-900">84</div>
               </div>
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Monthly Revenue</h3>
                  <div className="mt-2 text-3xl font-bold text-green-600">$45,200</div>
               </div>
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Server Health</h3>
                  <div className="mt-2 text-3xl font-bold text-brand-600">99.9%</div>
               </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-6">User Growth</h2>
                  <div className="h-72">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={userGrowthData}>
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                           <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                           <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff'}} />
                        </LineChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Signups</h2>
                  <div className="space-y-4">
                     {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                              <img src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} alt="" />
                           </div>
                           <div className="flex-1">
                              <div className="text-sm font-bold text-slate-800">New User {i}</div>
                              <div className="text-xs text-gray-500">Student • Joined 2h ago</div>
                           </div>
                           <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
               <h2 className="text-lg font-bold text-slate-900">User Management</h2>
               <div className="flex gap-2">
                  <input type="text" placeholder="Search users..." className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  <button className="bg-brand-50 text-brand-700 font-bold px-4 py-2 rounded-lg text-sm">Filter</button>
               </div>
            </div>
            <table className="w-full text-left text-sm text-gray-600">
               <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-xs">
                  <tr>
                     <th className="px-6 py-4">Name</th>
                     <th className="px-6 py-4">Role</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Joined</th>
                     <th className="px-6 py-4">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                     <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">John Doe {i}</td>
                        <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${i % 3 === 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-50 text-blue-700'}`}>{i % 3 === 0 ? 'Teacher' : 'Student'}</span></td>
                        <td className="px-6 py-4"><span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold">Active</span></td>
                        <td className="px-6 py-4">Oct 24, 2024</td>
                        <td className="px-6 py-4">
                           <div className="flex gap-3 text-sm font-medium">
                              <button className="text-brand-600 hover:text-brand-800">Edit</button>
                              <button className="text-red-500 hover:text-red-700">Suspend</button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
               <button className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-600 text-sm">Previous</button>
               <button className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-600 text-sm">Next</button>
            </div>
         </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
         <div className="max-w-3xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
               <h2 className="text-xl font-bold text-slate-900 mb-6 border-b pb-4">General Settings</h2>
               <div className="space-y-6">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                     <input type="text" defaultValue="LMS Pro" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Admin Contact Email</label>
                     <input type="email" defaultValue="admin@lmspro.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white" />
                  </div>
                  <div className="flex items-center justify-between py-4 border-t border-gray-100">
                     <div>
                        <h3 className="font-medium text-slate-900">Maintenance Mode</h3>
                        <p className="text-sm text-gray-500">Disable access for all non-admin users</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                     </label>
                  </div>
                  <div className="flex items-center justify-between py-4 border-t border-gray-100">
                     <div>
                        <h3 className="font-medium text-slate-900">Allow New Registrations</h3>
                        <p className="text-sm text-gray-500">If disabled, only admins can create users</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                     </label>
                  </div>
               </div>
               <div className="mt-8 flex justify-end">
                  <button className="px-6 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 shadow-lg shadow-brand-500/20">Save Changes</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default AdminDashboard;