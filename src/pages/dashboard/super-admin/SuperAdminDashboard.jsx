import { useState, useEffect } from "react";
import { FaUsers, FaMoneyBillWave, FaServer, FaExclamationTriangle, FaChartPie } from "react-icons/fa";
import { userAPI, paymentAPI } from "../../../utils/api";
import toast from "react-hot-toast";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Helmet } from "react-helmet-async";

const SuperAdminDashboard = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const [userStatsRes, paymentStatsRes] = await Promise.all([
                    userAPI.getUserStats(),
                    paymentAPI.getPaymentStats()
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

                    // Prepare chart data
                    setChartData([
                        { name: 'Borrowers', value: uStats.roleBreakdown?.borrowers || 0 },
                        { name: 'Managers', value: uStats.roleBreakdown?.managers || 0 },
                        { name: 'Admins', value: uStats.roleBreakdown?.admins || 0 }
                    ]);
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
        <div className="p-6">
            <Helmet>
                <title>Super Admin Dashboard | LoanLink</title>
            </Helmet>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Super Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className={`card shadow-xl ${stat.color} hover:shadow-2xl transition-shadow`}>
                        <div className="card-body">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="card-title text-gray-600 font-medium text-sm uppercase">{stat.title}</h2>
                                    <p className="text-4xl font-bold mt-2 text-gray-800">{stat.value}</p>
                                </div>
                                <div className="p-3 rounded-full bg-white bg-opacity-50">
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-gray-500">
                                {stat.desc}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Distribution Chart */}
                <div className="card bg-base-100 shadow-xl border border-gray-100 lg:col-span-1">
                    <div className="card-body">
                        <h2 className="card-title mb-4 flex items-center gap-2 text-lg">
                            <FaChartPie className="text-primary" /> User Distribution
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

                {/* Recent Activity */}
                <div className="card bg-base-100 shadow-xl border border-gray-100">
                    <div className="card-body">
                        <h2 className="card-title mb-4 text-lg">Recent System Activity</h2>
                        <ul className="steps steps-vertical">
                            <li className="step step-primary">New admin account created</li>
                            <li className="step step-primary">Database backup completed</li>
                            <li className="step">System update scheduled</li>
                            <li className="step">User permissions updated</li>
                        </ul>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="card bg-base-100 shadow-xl border border-gray-100">
                    <div className="card-body">
                         <h2 className="card-title mb-4 text-lg">Quick Actions</h2>
                         <div className="grid grid-cols-2 gap-4">
                            <button className="btn btn-outline btn-primary btn-sm">Add Admin</button>
                            <button className="btn btn-outline btn-secondary btn-sm">Audit Logs</button>
                            <button className="btn btn-outline btn-accent btn-sm">Settings</button>
                            <button className="btn btn-outline btn-sm">Report</button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
