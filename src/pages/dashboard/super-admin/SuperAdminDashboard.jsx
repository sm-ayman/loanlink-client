import { FaUsers, FaMoneyBillWave, FaServer, FaExclamationTriangle } from "react-icons/fa";

const SuperAdminDashboard = () => {
    // Static data for demonstration
    const stats = [
        {
            title: "Total Users",
            value: "1,245",
            icon: <FaUsers className="text-3xl text-primary" />,
            desc: "Active users across all roles",
            color: "bg-primary/10"
        },
        {
            title: "Total Loans",
            value: "$5.2M",
            icon: <FaMoneyBillWave className="text-3xl text-secondary" />,
            desc: "Total loan volume processed",
            color: "bg-secondary/10"
        },
        {
            title: "System Health",
            value: "98%",
            icon: <FaServer className="text-3xl text-success" />,
            desc: "Server uptime in last 30 days",
            color: "bg-success/10"
        },
        {
            title: "Pending Issues",
            value: "12",
            icon: <FaExclamationTriangle className="text-3xl text-warning" />,
            desc: "Reports requiring attention",
            color: "bg-warning/10"
        }
    ];

    return (
        <div className="p-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity Placeholder */}
                <div className="card bg-base-100 shadow-xl border border-gray-100">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Recent System Activity</h2>
                        <ul className="steps steps-vertical">
                            <li className="step step-primary">New admin account created</li>
                            <li className="step step-primary">Database backup completed</li>
                            <li className="step">System update scheduled</li>
                            <li className="step">User permissions updated</li>
                        </ul>
                    </div>
                </div>

                {/* Quick Actions Placeholder */}
                <div className="card bg-base-100 shadow-xl border border-gray-100">
                    <div className="card-body">
                         <h2 className="card-title mb-4">Quick Actions</h2>
                         <div className="grid grid-cols-2 gap-4">
                            <button className="btn btn-outline btn-primary">Add New Admin</button>
                            <button className="btn btn-outline btn-secondary">View Audit Logs</button>
                            <button className="btn btn-outline btn-accent">System Settings</button>
                            <button className="btn btn-outline">Generate Report</button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
