import React from 'react';
import { Users, Mountain, FileText, AlertTriangle, TrendingUp, Activity, Clock, MapPin, Heart, Trophy, Cloud, Sun, Droplets, Wind, Compass, Navigation, Flag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    trend?: string;
    trendDirection?: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, bgColor, trend, trendDirection = 'up' }) => (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-none shadow-md">
        <CardContent className="p-0">
            <div className="relative">
                <div className={`absolute inset-0 ${bgColor} opacity-5`}></div>
                <div className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${bgColor} bg-opacity-10 backdrop-blur-sm`}>
                            <div className={color}>
                                {icon}
                            </div>
                        </div>
                        {trend && (
                            <div className={`flex items-center gap-1 text-xs font-semibold ${trendDirection === 'up' ? 'text-green-700' : 'text-red-600'}`}>
                                <TrendingUp className={`w-3 h-3 ${trendDirection === 'down' ? 'rotate-180' : ''}`} />
                                <span>{trend}</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm mb-1">{title}</p>
                        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

interface ActivityItem {
    id: number;
    user: string;
    action: string;
    trail?: string;
    time: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
}

interface PopularTrail {
    id: number;
    name: string;
    difficulty: 'Easy' | 'Moderate' | 'Hard';
    completions: number;
    rating: number;
    location: string;
}

const Dashboard: React.FC = () => {
    // Stats with trekking theme
    const stats = [
        {
            title: 'Active Trekkers',
            value: '1,234',
            icon: <Users className="w-6 h-6" />,
            color: 'text-forest-green',
            bgColor: 'bg-green-600',
            trend: '+12%',
            trendDirection: 'up' as const
        },
        {
            title: 'Total Trails',
            value: '56',
            icon: <Mountain className="w-6 h-6" />,
            color: 'text-sage-green',
            bgColor: 'bg-green-500',
            trend: '+8%',
            trendDirection: 'up' as const
        },
        {
            title: 'Active Groups',
            value: '89',
            icon: <Compass className="w-6 h-6" />,
            color: 'text-amber-600',
            bgColor: 'bg-amber-500',
            trend: '+24%',
            trendDirection: 'up' as const
        },
        {
            title: 'Safety Reports',
            value: '12',
            icon: <AlertTriangle className="w-6 h-6" />,
            color: 'text-red-600',
            bgColor: 'bg-red-500',
            trend: '-18%',
            trendDirection: 'down' as const
        },
    ];

    // Recent activities specific to trekking
    const recentActivities: ActivityItem[] = [
        {
            id: 1,
            user: 'Sarah Chen',
            action: 'completed',
            trail: 'Mount Fansipan Trail',
            time: '2 hours ago',
            icon: <Flag className="w-5 h-5" />,
            color: 'text-green-600',
            bgColor: 'bg-green-500'
        },
        {
            id: 2,
            user: 'Mike Nguyen',
            action: 'created a new trail route',
            trail: 'Ba Vi National Park Loop',
            time: '3 hours ago',
            icon: <Mountain className="w-5 h-5" />,
            color: 'text-sage-green',
            bgColor: 'bg-green-500'
        },
        {
            id: 3,
            user: 'Emma Tran',
            action: 'joined group trek to',
            trail: 'Sapa Rice Terraces',
            time: '5 hours ago',
            icon: <Users className="w-5 h-5" />,
            color: 'text-amber-600',
            bgColor: 'bg-amber-500'
        },
        {
            id: 4,
            user: 'David Le',
            action: 'reported weather update for',
            trail: 'Cat Ba Island Trail',
            time: '6 hours ago',
            icon: <Cloud className="w-5 h-5" />,
            color: 'text-blue-600',
            bgColor: 'bg-blue-500'
        },
    ];

    // Popular trails data
    const popularTrails: PopularTrail[] = [
        { id: 1, name: 'Mount Fansipan', difficulty: 'Hard', completions: 234, rating: 4.8, location: 'Sapa, Lào Cai' },
        { id: 2, name: 'Ba Vi Summit Trail', difficulty: 'Moderate', completions: 456, rating: 4.6, location: 'Ba Vì, Hanoi' },
        { id: 3, name: 'Tam Dao Loop', difficulty: 'Easy', completions: 589, rating: 4.7, location: 'Tam Đảo, Vĩnh Phúc' },
        { id: 4, name: 'Cat Ba Peak', difficulty: 'Moderate', completions: 378, rating: 4.5, location: 'Cat Ba, Hải Phòng' },
    ];

    // Chart data - User growth over last 7 days
    const userGrowthData = [
        { day: 'Mon', users: 980, groups: 65 },
        { day: 'Tue', users: 1050, groups: 72 },
        { day: 'Wed', users: 1120, groups: 78 },
        { day: 'Thu', users: 1080, groups: 75 },
        { day: 'Fri', users: 1150, groups: 82 },
        { day: 'Sat', users: 1200, groups: 87 },
        { day: 'Sun', users: 1234, groups: 89 },
    ];

    // Trail difficulty distribution
    const difficultyData = [
        { name: 'Easy', value: 22, color: '#86efac' },
        { name: 'Moderate', value: 20, color: '#fbbf24' },
        { name: 'Hard', value: 14, color: '#ef4444' },
    ];

    // Completion rate by month
    const completionData = [
        { month: 'Sep', completions: 420 },
        { month: 'Oct', completions: 580 },
        { month: 'Nov', completions: 650 },
        { month: 'Dec', completions: 720 },
        { month: 'Jan', completions: 890 },
    ];

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-100 text-green-700 border-green-300';
            case 'Moderate': return 'bg-amber-100 text-amber-700 border-amber-300';
            case 'Hard': return 'bg-red-100 text-red-700 border-red-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    return (
        <div className="space-y-8 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-50 via-cream to-green-50/30 min-h-screen">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-forest-green bg-opacity-10">
                        <Activity className="w-8 h-8 text-forest-green" />
                    </div>
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-forest-green">
                            Trail Analytics Dashboard
                        </h2>
                        <p className="text-gray-600 mt-1">Track your community's trekking journey</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User & Group Growth */}
                <Card className="lg:col-span-2 border-none shadow-lg">
                    <CardHeader className="border-b bg-gradient-to-r from-white to-green-50/30">
                        <CardTitle className="flex items-center gap-2 text-forest-green">
                            <TrendingUp className="w-5 h-5" />
                            Community Growth (Last 7 Days)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={userGrowthData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorGroups" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="day" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" name="Users" />
                                <Area type="monotone" dataKey="groups" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorGroups)" name="Groups" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Trail Difficulty Distribution */}
                <Card className="border-none shadow-lg">
                    <CardHeader className="border-b bg-gradient-to-r from-white to-green-50/30">
                        <CardTitle className="flex items-center gap-2 text-forest-green">
                            <Mountain className="w-5 h-5" />
                            Trail Difficulty
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={difficultyData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {difficultyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Trail Completions Chart */}
            <Card className="border-none shadow-lg">
                <CardHeader className="border-b bg-gradient-to-r from-white to-green-50/30">
                    <CardTitle className="flex items-center gap-2 text-forest-green">
                        <Flag className="w-5 h-5" />
                        Trail Completions Trend
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={completionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                            />
                            <Bar dataKey="completions" fill="#10b981" radius={[8, 8, 0, 0]} name="Completions" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Popular Trails & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Popular Trails */}
                <Card className="border-none shadow-lg">
                    <CardHeader className="border-b bg-gradient-to-r from-white to-green-50/30">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-forest-green">
                                <Trophy className="w-5 h-5" />
                                Popular Trails This Week
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {popularTrails.map((trail) => (
                                <div 
                                    key={trail.id} 
                                    className="flex items-center gap-4 p-4 hover:bg-green-50/50 rounded-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-green-200"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
                                            #{trail.id}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-semibold text-gray-900 truncate">{trail.name}</p>
                                            <span className={`px-2 py-0.5 text-xs rounded-full border ${getDifficultyColor(trail.difficulty)}`}>
                                                {trail.difficulty}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {trail.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                                                {trail.rating}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-forest-green">{trail.completions}</p>
                                        <p className="text-xs text-gray-500">completions</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-none shadow-lg">
                    <CardHeader className="border-b bg-gradient-to-r from-white to-green-50/30">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-forest-green">
                                <Clock className="w-5 h-5" />
                                Recent Activity
                            </CardTitle>
                            <button className="text-sm text-sage-green hover:text-forest-green font-medium transition-colors">
                                View All
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <div 
                                    key={activity.id} 
                                    className="flex items-center gap-4 p-3 hover:bg-green-50/50 rounded-xl transition-all duration-300 group cursor-pointer"
                                >
                                    <div className={`w-10 h-10 rounded-full ${activity.bgColor} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <div className={activity.color}>
                                            {activity.icon}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-gray-800 text-sm">
                                            <span className="font-semibold">{activity.user}</span> {activity.action}
                                            {activity.trail && <span className="text-forest-green font-medium"> {activity.trail}</span>}
                                        </p>
                                        <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                                            <Clock className="w-3 h-3" />
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Weather Overview & Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Weather Cards */}
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Sun className="w-8 h-8 text-amber-500" />
                            <span className="text-2xl font-bold text-gray-900">28°C</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">Sapa Valley</p>
                        <p className="text-xs text-gray-600">Clear sky, Perfect hiking</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-gray-50 to-gray-100/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Cloud className="w-8 h-8 text-gray-500" />
                            <span className="text-2xl font-bold text-gray-900">22°C</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">Ba Vi Peak</p>
                        <p className="text-xs text-gray-600">Cloudy, Moderate conditions</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-blue-100 to-blue-200/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Droplets className="w-8 h-8 text-blue-600" />
                            <span className="text-2xl font-bold text-gray-900">18°C</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">Cat Ba Island</p>
                        <p className="text-xs text-gray-600">Light rain, Not recommended</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-green-50 to-green-100/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Wind className="w-8 h-8 text-green-600" />
                            <span className="text-2xl font-bold text-gray-900">25°C</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">Tam Dao Loop</p>
                        <p className="text-xs text-gray-600">Breezy, Great for trekking</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br from-white to-green-50/30">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-forest-green bg-opacity-10 group-hover:bg-opacity-20 transition-all">
                                <Users className="w-6 h-6 text-forest-green" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Manage Users</h4>
                                <p className="text-sm text-gray-600">View trekker profiles</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br from-white to-green-50/30">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-sage-green bg-opacity-10 group-hover:bg-opacity-20 transition-all">
                                <Mountain className="w-6 h-6 text-sage-green" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Manage Trails</h4>
                                <p className="text-sm text-gray-600">Add and edit routes</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br from-white to-amber-50/30">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-amber-500 bg-opacity-10 group-hover:bg-opacity-20 transition-all">
                                <Navigation className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Safety Reports</h4>
                                <p className="text-sm text-gray-600">Monitor trail conditions</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
