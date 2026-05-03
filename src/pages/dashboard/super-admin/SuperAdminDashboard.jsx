import { useState, useEffect } from "react";
import { FaUsers, FaMoneyBillWave, FaServer, FaExclamationTriangle, FaChartPie, FaChartLine, FaHistory } from "react-icons/fa";
import { userAPI, paymentAPI, applicationAPI } from "../../../utils/api";
import toast from "react-hot-toast";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Helmet } from "react-helmet-async";

const SuperAdminDashboard = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [recentApps, setRecentApps] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const [userStatsRes, paymentStatsRes, recentAppsRes] = await Promise.all([
                    userAPI.getUserStats(),
                    paymentAPI.getPaymentStats(),
                    applicationAPI.getRecentApplications()
                ]);

                if (userStatsRes.success && paymentStatsRes.success) {
                    const uStats = userStatsRes.data;
                    const pStats = paymentStatsRes.data;

                    setStats([
                        {
                            title: "Total Users",
                            value: uStats.totalUsers?.toLocaleString() || "0",
                            icon: <FaUsers className="text-3xl text-primary" />,
                            desc: `B: ${uStats.roleBreakdown?.borrowers || 0}, M: ${uStats.roleBreakdown?.managers || 0}, A: ${uStats.roleBreakdown?.admins || 0}`,
                            color: "bg-primary/10"
                        },
                        {
                            title: "Total Revenue",
                            value: `$${pStats.totalRevenue?.toLocaleString() || "0"}`,
                            icon: <FaMoneyBillWave className="text-3xl text-secondary" />,
                            desc: `From ${pStats.totalPayments || 0} applications`,
                            color: "bg-secondary/10"
                        },
                        {
                            title: "Suspended Users",
                            value: uStats.suspendedUsers?.toString() || "0",
                            icon: <FaExclamationTriangle className="text-3xl text-warning" />,
                            desc: "Users currently restricted",
                            color: "bg-warning/10"
                        },
                        {
                            title: "Recent Regs",
                            value: uStats.recentRegistrations?.toString() || "0",
                            icon: <FaServer className="text-3xl text-success" />,
                            desc: "Last 30 days",
                            color: "bg-success/10"
                        }
                    ]);

                    // Prepare pie chart data
                    setChartData([
                        { name: 'Borrowers', value: uStats.roleBreakdown?.borrowers || 0 },
                        { name: 'Managers', value: uStats.roleBreakdown?.managers || 0 },
                        { name: 'Admins', value: uStats.roleBreakdown?.admins || 0 }
                    ]);

                    // Prepare revenue area chart data
                    const revData = pStats.monthlyRevenue?.map(item => ({
                        month: `${item._id.month}/${item._id.year}`,
                        revenue: item.total
                    })).reverse() || [];
                    
                    if (revData.length === 0) {
                        setRevenueData([
                            { month: 'Jan', revenue: 0 }, { month: 'Feb', revenue: 10 }, { month: 'Mar', revenue: 20 }, { month: 'Apr', revenue: 50 }, { month: 'May', revenue: 30 }
                        ]);
                    } else {
                        setRevenueData(revData);
                    }
                }

                if (recentAppsRes.success) {
                    setRecentApps(recentAppsRes.data.applications);
                }
            } catch (err) {
                console.error("Error fetching stats:", err);
                toast.error("Failed to load dashboard statistics");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const COLORS = ['#10B981', '#3B82F6', '#F59E0B'];

    if (loading) return <div className="flex justify-center items-center min-h-screen"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div className="p-6 bg-base-200 min-h-screen">
            <Helmet>
                <title>Super Admin Dashboard | LoanLink</title>
            </Helmet>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Super Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className={`card shadow-xl ${stat.color} bg-base-100 hover:shadow-2xl transition-shadow border border-base-200`}>
                        <div className="card-body">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="card-title text-gray-600 font-medium text-sm uppercase tracking-wider">{stat.title}</h2>
                                    <p className="text-4xl font-bold mt-2 text-gray-800">{stat.value}</p>
                                </div>
                                <div className="p-3 rounded-2xl bg-base-200">
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="mt-4 text-xs font-semibold text-gray-400">
                                {stat.desc}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Trend Chart */}
                <div className="card bg-base-100 shadow-xl border border-base-200 lg:col-span-2">
                    <div className="card-body">
                        <h2 className="card-title mb-6 flex items-center gap-2 text-lg">
                            <FaChartLine className="text-secondary" /> Revenue Growth Trend
                        </h2>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* User Distribution Chart */}
                <div className="card bg-base-100 shadow-xl border border-base-200 lg:col-span-1">
                    <div className="card-body">
                        <h2 className="card-title mb-6 flex items-center gap-2 text-lg">
                            <FaChartPie className="text-primary" /> User Role Split
                        </h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body">
                        <h2 className="card-title mb-4 text-lg flex items-center gap-2">
                            <FaHistory className="text-accent" /> Recent Activity
                        </h2>
                        <div className="space-y-4">
                            {recentApps.length > 0 ? (
                                recentApps.map((app) => (
                                    <div key={app._id} className="flex flex-col gap-1 p-3 bg-base-200 rounded-xl hover:bg-base-300 transition-colors">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-xs truncate max-w-[120px]">{app.userId?.name}</span>
                                            <span className={`badge badge-xs ${app.status === 'pending' ? 'badge-warning' : app.status === 'approved' ? 'badge-success' : 'badge-error'}`}>{app.status}</span>
                                        </div>
                                        <p className="text-[10px] opacity-60">Applied for {app.loanId?.title}</p>
                                        <p className="text-[9px] opacity-40 self-end">{new Date(app.createdAt).toLocaleDateString()}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-10 opacity-50 text-sm italic">No recent activity found</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="card bg-base-100 shadow-xl border border-base-200 lg:col-span-2">
                    <div className="card-body">
                         <h2 className="card-title mb-4 text-lg">Administrative Tools</h2>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button className="btn btn-outline btn-primary btn-sm h-12">New Admin</button>
                            <button className="btn btn-outline btn-secondary btn-sm h-12">Audit Logs</button>
                            <button className="btn btn-outline btn-accent btn-sm h-12">Settings</button>
                            <button className="btn btn-outline btn-sm h-12">Reports</button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
