import React, { useState } from 'react';
import { Search, Filter, UserCheck, UserX, Mail, Mountain, Clock, TrendingUp, Award, MapPin, Calendar, BarChart3, Download, UserCog, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { User } from '../../types';

// Mock Data for Users
const MOCK_USERS_LIST: User[] = [
    {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        role: 'user',
        status: 'active',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        totalKm: 342,
        avgAltitude: 1250,
        avgTimeHr: 28,
        tripHistory: [],
        preferences: { difficulty: ['Hard', 'Moderate'], scenery: ['Mountain'] }
    },
    {
        id: '2',
        name: 'Admin User',
        email: 'admin@trailsexplorer.com',
        role: 'admin',
        status: 'active',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        totalKm: 0,
        avgAltitude: 0,
        avgTimeHr: 0,
        tripHistory: [],
        preferences: { difficulty: [], scenery: [] }
    },
    {
        id: '3',
        name: 'Mike Nguyen',
        email: 'mike.nguyen@example.com',
        role: 'user',
        status: 'active',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        totalKm: 567,
        avgAltitude: 890,
        avgTimeHr: 45,
        tripHistory: [],
        preferences: { difficulty: ['Moderate'], scenery: ['Forest'] }
    },
    {
        id: '4',
        name: 'Emma Tran',
        email: 'emma.tran@example.com',
        role: 'user',
        status: 'inactive',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        totalKm: 128,
        avgAltitude: 450,
        avgTimeHr: 12,
        tripHistory: [],
        preferences: { difficulty: ['Easy', 'Moderate'], scenery: [] }
    },
    {
        id: '5',
        name: 'David Le',
        email: 'david.le@example.com',
        role: 'user',
        status: 'active',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        totalKm: 789,
        avgAltitude: 1580,
        avgTimeHr: 62,
        tripHistory: [],
        preferences: { difficulty: ['Hard'], scenery: ['Mountain', 'Forest'] }
    },
    {
        id: '6',
        name: 'Lisa Pham',
        email: 'lisa.pham@example.com',
        role: 'user',
        status: 'active',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
        totalKm: 234,
        avgAltitude: 680,
        avgTimeHr: 19,
        tripHistory: [],
        preferences: { difficulty: ['Easy'], scenery: ['Beach'] }
    },
];

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>(MOCK_USERS_LIST);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const toggleStatus = (userId: string) => {
        setUsers(users.map(user => {
            if (user.id === userId) {
                return {
                    ...user,
                    status: user.status === 'active' ? 'inactive' : 'active'
                };
            }
            return user;
        }));
    };

    // Filter users based on search and filters
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Calculate statistics
    const stats = {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        inactive: users.filter(u => u.status === 'inactive').length,
        admins: users.filter(u => u.role === 'admin').length,
    };

    // Top trekkers by total km
    const topTrekkers = [...users]
        .filter(u => u.role !== 'admin')
        .sort((a, b) => b.totalKm - a.totalKm)
        .slice(0, 5)
        .map(u => ({ name: u.name.split(' ')[0], km: u.totalKm }));

    // User activity distribution
    const activityData = [
        { range: '0-100km', count: users.filter(u => u.totalKm >= 0 && u.totalKm < 100).length },
        { range: '100-300km', count: users.filter(u => u.totalKm >= 100 && u.totalKm < 300).length },
        { range: '300-500km', count: users.filter(u => u.totalKm >= 300 && u.totalKm < 500).length },
        { range: '500km+', count: users.filter(u => u.totalKm >= 500).length },
    ];

    // Status pie chart data
    const statusData = [
        { name: 'Active', value: stats.active, color: '#10b981' },
        { name: 'Inactive', value: stats.inactive, color: '#ef4444' },
    ];

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-50 via-cream to-green-50/30 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-forest-green">User Management</h2>
                    <p className="text-gray-600 mt-1">Manage trekker accounts and track community activity</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-forest-green text-white rounded-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg">
                    <Download className="w-4 h-4" />
                    Export Data
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                                <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
                            </div>
                            <div className="p-3 rounded-xl bg-forest-green bg-opacity-10">
                                <UserCheck className="w-6 h-6 text-forest-green" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Active Users</p>
                                <h3 className="text-2xl font-bold text-green-700">{stats.active}</h3>
                            </div>
                            <div className="p-3 rounded-xl bg-green-500 bg-opacity-10">
                                <UserCheck className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Inactive Users</p>
                                <h3 className="text-2xl font-bold text-red-700">{stats.inactive}</h3>
                            </div>
                            <div className="p-3 rounded-xl bg-red-500 bg-opacity-10">
                                <UserX className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Administrators</p>
                                <h3 className="text-2xl font-bold text-purple-700">{stats.admins}</h3>
                            </div>
                            <div className="p-3 rounded-xl bg-purple-500 bg-opacity-10">
                                <Shield className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Trekkers */}
                <Card className="border-none shadow-lg">
                    <CardHeader className="border-b bg-gradient-to-r from-white to-green-50/30">
                        <CardTitle className="flex items-center gap-2 text-forest-green">
                            <Award className="w-5 h-5" />
                            Top Trekkers (by Distance)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={topTrekkers} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis type="number" stroke="#6b7280" />
                                <YAxis dataKey="name" type="category" stroke="#6b7280" width={80} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                    formatter={(value) => [`${value} km`, 'Distance']}
                                />
                                <Bar dataKey="km" fill="#10b981" radius={[0, 8, 8, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Activity Distribution */}
                <Card className="border-none shadow-lg">
                    <CardHeader className="border-b bg-gradient-to-r from-white to-green-50/30">
                        <CardTitle className="flex items-center gap-2 text-forest-green">
                            <BarChart3 className="w-5 h-5" />
                            User Activity Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="range" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                    formatter={(value) => [`${value} users`, 'Count']}
                                />
                                <Bar dataKey="count" fill="#7c9885" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-sage-green focus:border-sage-green"
                            />
                        </div>

                        {/* Role Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-500" />
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value as any)}
                                className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-sage-green focus:border-sage-green"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-500" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                                className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-sage-green focus:border-sage-green"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="border-none shadow-lg">
                <CardHeader className="border-b bg-gradient-to-r from-white to-green-50/30">
                    <CardTitle className="text-forest-green">
                        Users ({filteredUsers.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">User</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Stats</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Role</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-green-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={user.avatarUrl}
                                                    alt={user.name}
                                                    className="w-12 h-12 rounded-full bg-gray-200 ring-2 ring-gray-100"
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-900">{user.name}</p>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role !== 'admin' ? (
                                                <div className="space-y-1 text-sm">
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Mountain className="w-3.5 h-3.5 text-green-600" />
                                                        <span className="font-medium">{user.totalKm} km</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                                                        <span>{user.avgAltitude}m avg</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                                                        <span>{user.avgTimeHr}h total</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                                    : 'bg-green-100 text-green-800 border border-green-200'
                                                }`}>
                                                {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.status === 'active'
                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                    : 'bg-red-100 text-red-800 border border-red-200'
                                                }`}>
                                                <div className={`w-2 h-2 rounded-full mr-2 ${user.status === 'active' ? 'bg-green-600' : 'bg-red-600'
                                                    }`}></div>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => user.id && toggleStatus(user.id)}
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow ${user.status === 'active'
                                                                ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                                                                : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                                                            }`}
                                                    >
                                                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                                                    </button>
                                                )}
                                                <button
                                                    className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all border border-gray-200"
                                                    title="Manage user"
                                                >
                                                    <UserCog className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <UserX className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500">No users found matching your criteria</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Users;
