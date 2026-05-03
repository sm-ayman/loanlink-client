import { useState, useEffect } from "react";
import { FaFileAlt, FaEye, FaSearch, FaFilter, FaUser } from "react-icons/fa";
import { applicationAPI } from "../../../utils/api";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const AllApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const [selectedApp, setSelectedApp] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const params = { status: statusFilter };
            const response = await applicationAPI.getAllApplications(params);
            if (response.success) {
                setApplications(response.data.applications);
            }
        } catch (error) {
            console.error("Error loading applications:", error);
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApplications();
    }, [statusFilter]);

    const openViewModal = (app) => {
        setSelectedApp(app);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6 bg-base-100 min-h-full">
            <Helmet>
                <title>All Loan Applications | Admin</title>
            </Helmet>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FaFileAlt className="text-secondary" /> Loan Applications
                    </h1>
                    <p className="opacity-70 mt-1">Monitor and review all loan requests in the system.</p>
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="form-control w-full md:w-48">
                        <select 
                            className="select select-bordered w-full"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-base-100 shadow-xl rounded-2xl border border-base-200">
                <table className="table w-full">
                    <thead className="bg-base-200">
                        <tr>
                            <th>Loan ID</th>
                            <th>User Info</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-20">
                                    <span className="loading loading-spinner loading-lg text-primary"></span>
                                </td>
                            </tr>
                        ) : applications.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-20">
                                    <div className="opacity-40 italic">No applications found matching the criteria.</div>
                                </td>
                            </tr>
                        ) : (
                                    applications.map((app) => (
                                <tr key={app._id} className="hover:bg-base-200 transition-colors">
                                    <td className="font-mono text-xs opacity-50">#{app._id.slice(-6).toUpperCase()}</td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar placeholder">
                                                <div className="bg-neutral text-neutral-content rounded-full w-8">
                                                    <span className="text-xs">{app.userId?.name?.charAt(0)}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{app.userId?.name}</div>
                                                <div className="text-xs opacity-50">{app.userId?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-sm badge-outline uppercase font-medium">{app.loanId?.category}</span>
                                    </td>
                                    <td className="font-bold text-primary">${app.loanAmount?.toLocaleString()}</td>
                                    <td>
                                        <span className={`badge badge-sm font-bold ${
                                            app.status === 'pending' ? 'badge-warning' :
                                            app.status === 'approved' ? 'badge-success' : 'badge-error'
                                        }`}>
                                            {app.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => openViewModal(app)}
                                            className="btn btn-xs btn-circle btn-ghost text-info tooltip" 
                                            data-tip="View Details"
                                        >
                                            <FaEye />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Modal */}
            {isModalOpen && selectedApp && (
                <div className={`modal modal-open`}>
                    <div className="modal-box w-11/12 max-w-4xl rounded-2xl bg-base-100 text-base-content">
                        <button onClick={() => setIsModalOpen(false)} className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
                        <h3 className="font-bold text-2xl mb-6 text-primary flex items-center gap-2">
                            <FaFileAlt /> Application Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="bg-base-200 p-4 rounded-xl">
                                    <h4 className="font-bold text-sm opacity-50 uppercase mb-3 flex items-center gap-2">
                                        <FaUser /> Applicant Information
                                    </h4>
                                    <div className="space-y-2">
                                        <p><span className="font-medium">Name:</span> {selectedApp.userId?.name}</p>
                                        <p><span className="font-medium">Email:</span> {selectedApp.userId?.email}</p>
                                        <p><span className="font-medium">Contact:</span> {selectedApp.contactNumber}</p>
                                        <p><span className="font-medium">NID/Passport:</span> {selectedApp.nationalId}</p>
                                        <p><span className="font-medium">Address:</span> {selectedApp.address}</p>
                                    </div>
                                </div>

                                <div className="bg-base-200 p-4 rounded-xl">
                                    <h4 className="font-bold text-sm opacity-50 uppercase mb-3">Financial Context</h4>
                                    <div className="space-y-2">
                                        <p><span className="font-medium">Income Source:</span> {selectedApp.incomeSource}</p>
                                        <p><span className="font-medium">Monthly Income:</span> ${selectedApp.monthlyIncome?.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                                    <h4 className="font-bold text-sm text-primary uppercase mb-3">Loan Details</h4>
                                    <div className="space-y-2">
                                        <p><span className="font-medium">Program:</span> {selectedApp.loanId?.title}</p>
                                        <p><span className="font-medium">Category:</span> {selectedApp.loanId?.category}</p>
                                        <p><span className="font-medium text-lg">Requested Amount:</span> <span className="text-xl font-bold text-primary">${selectedApp.loanAmount?.toLocaleString()}</span></p>
                                        <p><span className="font-medium">Interest Rate:</span> {selectedApp.loanId?.interestRate}%</p>
                                    </div>
                                </div>

                                <div className="bg-base-200 p-4 rounded-xl">
                                    <h4 className="font-bold text-sm opacity-50 uppercase mb-3">Reason & Notes</h4>
                                    <p className="text-sm italic">"{selectedApp.reasonForLoan}"</p>
                                    {selectedApp.extraNotes && (
                                        <div className="mt-3 pt-3 border-t border-base-300">
                                            <p className="text-xs font-bold opacity-40 uppercase">Extra Notes:</p>
                                            <p className="text-sm">{selectedApp.extraNotes}</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex justify-between items-center p-2">
                                    <div className={`badge badge-lg font-bold ${
                                        selectedApp.status === 'pending' ? 'badge-warning' :
                                        selectedApp.status === 'approved' ? 'badge-success' : 'badge-error'
                                    }`}>
                                        STATUS: {selectedApp.status.toUpperCase()}
                                    </div>
                                    <div className="text-xs opacity-40">
                                        Applied on: {new Date(selectedApp.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button className="btn btn-primary px-10" onClick={() => setIsModalOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllApplications;

