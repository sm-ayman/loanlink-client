import { FaFileAlt, FaClipboardCheck, FaRegCalendarAlt } from "react-icons/fa";

const AllApplications = () => {
    // Mock applications data
    const applications = [
        { id: 101, applicant: "Sarah Connor", requestedAmount: "$12,000", income: "$45,000/yr", creditScore: 720, date: "2023-11-01" },
        { id: 102, applicant: "Kyle Reese", requestedAmount: "$5,000", income: "$30,000/yr", creditScore: 650, date: "2023-11-02" },
        { id: 103, applicant: "T-800", requestedAmount: "$100,000", income: "$0/yr", creditScore: 850, date: "2023-11-03" },
    ];

    return (
        <div className="p-6 h-full">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3 text-secondary">
                <FaFileAlt /> Loan Applications
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((app) => (
                    <div key={app.id} className="card bg-base-100 shadow-xl border border-gray-100 hover:shadow-2xl transition-all">
                        <div className="card-body">
                            <div className="flex justify-between items-start">
                                <h2 className="card-title text-xl text-primary">{app.applicant}</h2>
                                <div className="badge badge-secondary badge-outline text-xs">New</div>
                            </div>
                            
                            <div className="divider my-2"></div>
                            
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Requested:</span>
                                    <span className="font-bold text-gray-800">{app.requestedAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Income:</span>
                                    <span>{app.income}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Credit Score:</span>
                                    <span className={`font-bold ${app.creditScore > 700 ? 'text-success' : 'text-warning'}`}>{app.creditScore}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                                    <span className="flex items-center gap-1"><FaRegCalendarAlt /> Applied:</span>
                                    <span>{app.date}</span>
                                </div>
                            </div>

                            <div className="card-actions justify-end mt-4">
                                <button className="btn btn-sm btn-primary w-full gap-2">
                                    <FaClipboardCheck /> Review Application
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {applications.length === 0 && (
                <div className="text-center py-20 bg-base-100 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No pending applications found.</p>
                </div>
            )}
        </div>
    );
};

export default AllApplications;
