import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { applicationAPI, paymentAPI } from '../../../utils/api';
import SectionTitle from '../../../components/shared/SectionTitle';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const MyLoans = () => {
    const { user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await applicationAPI.getMyApplications();
            if (response.success) {
                setApplications(response.data.applications);
            }
        } catch (err) {
            console.error("Error fetching applications:", err);
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleCancel = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You want to cancel this application?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await applicationAPI.cancelApplication(id);
                if (response.success) {
                    toast.success('Application cancelled successfully');
                    fetchApplications();
                }
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to cancel application');
            }
        }
    };

    const handlePay = async (id) => {
        try {
            toast.loading('Redirecting to Stripe...', { id: 'payment' });
            const response = await paymentAPI.createPaymentSession(id);
            if (response.success && response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to initiate payment', { id: 'payment' });
        }
    };

    const handleViewPaymentDetails = async (id) => {
        try {
            setIsDetailsLoading(true);
            document.getElementById('payment_details_modal').showModal();
            const response = await paymentAPI.getPaymentDetails(id);
            if (response.success) {
                setPaymentDetails(response.data.payment);
            }
        } catch (err) {
            console.error("Error fetching payment details:", err);
            toast.error("Failed to load payment details");
            document.getElementById('payment_details_modal').close();
        } finally {
            setIsDetailsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'badge-warning';
            case 'approved': return 'badge-success';
            case 'rejected': return 'badge-error';
            default: return 'badge-ghost';
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div className="p-4 md:p-10 bg-base-200 min-h-screen">
            <SectionTitle heading="My Loan Applications" subHeading="Track your microloan status and payments" />

            <div className="bg-base-100 rounded-2xl shadow-sm overflow-hidden border border-base-200">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-base-300">
                            <tr>
                                <th>Loan Info</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Fee</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 opacity-50 italic">You haven't applied for any loans yet.</td>
                                </tr>
                            ) : (
                                applications.map((app) => (
                                    <tr key={app._id} className="hover:bg-base-200/50 transition-colors">
                                        <td>
                                            <div className="font-bold">{app.loanId?.title || 'Unknown Loan'}</div>
                                            <div className="text-sm opacity-50">ID: {app._id.substring(0, 8)}...</div>
                                        </td>
                                        <td className="font-bold text-primary">${app.loanAmount?.toLocaleString()}</td>
                                        <td>
                                            <span className={`badge ${getStatusColor(app.status)} font-semibold uppercase`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td>
                                            {app.applicationFeeStatus === 'paid' ? (
                                                <button 
                                                    onClick={() => handleViewPaymentDetails(app._id)}
                                                    className="badge badge-success cursor-pointer hover:scale-105 transition-transform"
                                                >
                                                    Paid
                                                </button>
                                            ) : (
                                                <span className="badge badge-error">Unpaid</span>
                                            )}
                                        </td>
                                        <td className="flex gap-2">
                                            <button 
                                                onClick={() => { setSelectedApplication(app); document.getElementById('details_modal').showModal(); }}
                                                className="btn btn-xs btn-outline btn-info"
                                            >
                                                View
                                            </button>
                                            
                                            {app.status === 'pending' && (
                                                <button 
                                                    onClick={() => handleCancel(app._id)}
                                                    className="btn btn-xs btn-outline btn-error"
                                                >
                                                    Cancel
                                                </button>
                                            )}

                                            {app.applicationFeeStatus === 'unpaid' && app.status === 'approved' && (
                                                <button 
                                                    onClick={() => handlePay(app._id)}
                                                    className="btn btn-xs btn-primary font-bold"
                                                >
                                                    Pay Fee
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Application Details Modal */}
            <dialog id="details_modal" className="modal">
                <div className="modal-box w-11/12 max-w-3xl bg-base-100 text-base-content">
                    <h3 className="font-bold text-2xl mb-4">Application Details</h3>
                    {selectedApplication && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-base-200 p-4 rounded-xl">
                                <p className="text-xs uppercase font-bold opacity-60">Loan</p>
                                <p className="font-bold">{selectedApplication.loanId?.title || 'Unknown'}</p>
                            </div>
                            <div className="bg-base-200 p-4 rounded-xl">
                                <p className="text-xs uppercase font-bold opacity-60">Requested Amount</p>
                                <p className="font-bold text-primary">${selectedApplication.loanAmount?.toLocaleString()}</p>
                            </div>
                            <div className="bg-base-200 p-4 rounded-xl">
                                <p className="text-xs uppercase font-bold opacity-60">Status</p>
                                <p className="font-bold uppercase">{selectedApplication.status}</p>
                            </div>
                            <div className="bg-base-200 p-4 rounded-xl">
                                <p className="text-xs uppercase font-bold opacity-60">Application Fee</p>
                                <p className="font-bold uppercase">{selectedApplication.applicationFeeStatus}</p>
                            </div>
                            <div className="bg-base-200 p-4 rounded-xl col-span-2">
                                <p className="text-xs uppercase font-bold opacity-60">Reason for Loan</p>
                                <p>{selectedApplication.reasonForLoan}</p>
                            </div>
                            <div className="bg-base-200 p-4 rounded-xl col-span-2">
                                <p className="text-xs uppercase font-bold opacity-60">Address</p>
                                <p>{selectedApplication.address}</p>
                            </div>
                        </div>
                    )}
                    <div className="modal-action">
                        <button className="btn" onClick={() => document.getElementById('details_modal').close()}>Close</button>
                    </div>
                </div>
            </dialog>

            {/* Payment Details Modal */}
            <dialog id="payment_details_modal" className="modal">
                <div className="modal-box w-11/12 max-w-lg bg-base-100 text-base-content">
                    <h3 className="font-bold text-2xl mb-6">Payment Information</h3>
                    {isDetailsLoading ? (
                        <div className="flex justify-center p-10">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : (
                        paymentDetails ? (
                            <div className="space-y-4">
                                <div className="flex justify-between border-b border-base-300 pb-2">
                                    <span className="opacity-60">Email:</span>
                                    <span className="font-semibold">{paymentDetails.email}</span>
                                </div>
                                <div className="flex justify-between border-b border-base-300 pb-2">
                                    <span className="opacity-60">Transaction ID:</span>
                                    <span className="font-mono text-xs">{paymentDetails.transactionId}</span>
                                </div>
                                <div className="flex justify-between border-b border-base-300 pb-2">
                                    <span className="opacity-60">Loan Title:</span>
                                    <span className="font-semibold">{paymentDetails.loanTitle}</span>
                                </div>
                                <div className="flex justify-between border-b border-base-300 pb-2">
                                    <span className="opacity-60">Fee Amount:</span>
                                    <span className="font-bold text-primary">${paymentDetails.amount}</span>
                                </div>
                                <div className="flex justify-between border-b border-base-300 pb-2">
                                    <span className="opacity-60">Payment Date:</span>
                                    <span className="font-semibold">{new Date(paymentDetails.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center py-6 text-error">Could not load payment details.</p>
                        )
                    )}
                    <div className="modal-action">
                        <button className="btn" onClick={() => document.getElementById('payment_details_modal').close()}>Close</button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default MyLoans;
