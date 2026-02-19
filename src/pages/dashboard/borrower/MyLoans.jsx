import { useState, useEffect } from "react";
import { FaEye, FaMoneyBillWave, FaCreditCard, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const MyLoans = () => {
    const [processingPayment, setProcessingPayment] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load user's applications (simulate by loading all and filtering by current user)
    useEffect(() => {
        const loadApplications = async () => {
            try {
                const response = await fetch('/applications.json');
                const applicationsData = await response.json();
                // In a real app, this would be filtered by current user
                // For demo purposes, showing all applications
                setApplications(applicationsData);
            } catch (error) {
                console.error('Error loading applications:', error);
                toast.error('Failed to load applications');
            } finally {
                setLoading(false);
            }
        };
        loadApplications();
    }, []);

    // Simulate payment processing
    const processPayment = (applicationId) => {
        setProcessingPayment(applicationId);

        // Simulate payment processing delay
        setTimeout(() => {
            setApplications(prevApps =>
                prevApps.map(app =>
                    app._id === applicationId
                        ? { ...app, applicationFeeStatus: 'paid' }
                        : app
                )
            );
            setProcessingPayment(null);
            toast.success("Payment completed successfully!");
        }, 2000);
    };

    const handlePayFee = async (application) => {
        const result = await Swal.fire({
            title: 'Pay Application Fee',
            html: `
                <div class="text-left space-y-3">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h3 class="font-bold text-lg mb-2">Payment Details</h3>
                        <p><strong>Application:</strong> ${application.loanId.title}</p>
                        <p><strong>Amount:</strong> $${application.loanAmount}</p>
                        <p><strong>Fee:</strong> $10.00 (Application Processing Fee)</p>
                    </div>
                    <div class="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                        <p class="text-yellow-800">
                            <strong>Note:</strong> This fee is required to process your loan application.
                            You will be redirected to a secure payment page.
                        </p>
                    </div>
                </div>
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#10B981',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Proceed to Payment',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            processPayment(application._id);
        }
    };

    const handleViewDetails = (application) => {
        const statusConfig = {
            'pending': { color: 'blue', icon: FaClock, text: 'Pending Review' },
            'approved': { color: 'green', icon: FaCheckCircle, text: 'Approved' },
            'rejected': { color: 'red', icon: FaTimesCircle, text: 'Rejected' }
        };

        const status = statusConfig[application.status] || statusConfig.pending;

        Swal.fire({
            title: 'Application Details',
            html: `
                <div class="text-left space-y-4 max-h-96 overflow-y-auto">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-bold text-lg mb-3">Loan Information</h3>
                        <p><strong>Loan:</strong> ${application.loanId.title}</p>
                        <p><strong>Category:</strong> ${application.loanId.category}</p>
                        <p><strong>Interest Rate:</strong> ${application.loanId.interestRate}%</p>
                        <p><strong>Requested Amount:</strong> $${application.loanAmount}</p>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-bold text-lg mb-3">Application Status</h3>
                        <div class="flex items-center gap-2">
                            <${status.icon} class="text-${status.color}-500" />
                            <span class="font-semibold text-${status.color}-700">${status.text}</span>
                        </div>
                        <p class="text-sm text-gray-600 mt-1">
                            Applied on ${new Date(application.createdAt).toLocaleDateString()}
                        </p>
                        ${application.approvedAt ? `<p class="text-sm text-green-600">Approved on ${new Date(application.approvedAt).toLocaleDateString()}</p>` : ''}
                        ${application.rejectedAt ? `<p class="text-sm text-red-600">Rejected on ${new Date(application.rejectedAt).toLocaleDateString()}</p>` : ''}
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-bold text-lg mb-3">Payment Status</h3>
                        <div class="flex items-center gap-2">
                            ${application.applicationFeeStatus === 'paid' ?
                                '<span class="text-green-600 font-semibold">✅ Fee Paid</span>' :
                                '<span class="text-orange-600 font-semibold">⏳ Fee Pending</span>'
                            }
                        </div>
                        ${application.applicationFeeStatus === 'paid' ?
                            '<p class="text-sm text-green-600 mt-1">Your application is being processed.</p>' :
                            '<p class="text-sm text-orange-600 mt-1">Please pay the $10 application fee to complete your application.</p>'
                        }
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-bold text-lg mb-3">Personal Information</h3>
                        <p><strong>Name:</strong> ${application.firstName} ${application.lastName}</p>
                        <p><strong>Contact:</strong> ${application.contactNumber}</p>
                        <p><strong>National ID:</strong> ${application.nationalId}</p>
                        <p><strong>Income Source:</strong> ${application.incomeSource}</p>
                        <p><strong>Monthly Income:</strong> $${application.monthlyIncome}</p>
                        <p><strong>Address:</strong> ${application.address}</p>
                    </div>

                    ${application.extraNotes ? `
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h3 class="font-bold text-lg mb-3">Additional Notes</h3>
                            <p>${application.extraNotes}</p>
                        </div>
                    ` : ''}
                </div>
            `,
            width: '600px',
            showCloseButton: true,
            showConfirmButton: false
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-primary">My Loan Applications</h1>
                    <p className="text-gray-600 mt-1">Track and manage your loan applications</p>
                </div>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <FaMoneyBillWave className="inline-block w-6 h-6 stroke-current" />
                        </div>
                        <div className="stat-title">Total Applications</div>
                        <div className="stat-value text-primary">{applications.length}</div>
                    </div>
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">📋</div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">No Applications Yet</h2>
                    <p className="text-gray-500 mb-4">You haven't applied for any loans yet</p>
                    <button
                        onClick={() => window.location.href = '/all-loans'}
                        className="btn btn-primary"
                    >
                        Browse Available Loans
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto bg-base-100 shadow-xl rounded-lg">
                    <table className="table w-full">
                        <thead className="bg-base-200">
                            <tr>
                                <th>#</th>
                                <th>Loan Details</th>
                                <th>Amount</th>
                                <th>Applied Date</th>
                                <th>Status</th>
                                <th>Fee Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app, index) => (
                                <tr key={app._id} className="hover">
                                    <th>{index + 1}</th>
                                    <td>
                                        <div>
                                            <div className="font-bold">{app.loanId.title}</div>
                                            <div className="text-sm text-gray-500">{app.loanId.category}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <FaMoneyBillWave className="text-green-500" />
                                            <span className="font-semibold">${app.loanAmount}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <FaClock className="text-gray-400" />
                                            <span className="text-sm">
                                                {new Date(app.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={`badge gap-1 ${
                                            app.status === 'approved' ? 'badge-success' :
                                            app.status === 'rejected' ? 'badge-error' : 'badge-warning'
                                        }`}>
                                            {app.status === 'approved' && <FaCheckCircle className="w-3 h-3" />}
                                            {app.status === 'rejected' && <FaTimesCircle className="w-3 h-3" />}
                                            {app.status === 'pending' && <FaClock className="w-3 h-3" />}
                                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-center">
                                            {app.applicationFeeStatus === 'paid' ? (
                                                <div className="badge badge-success badge-outline gap-1 cursor-pointer"
                                                     onClick={() => handleViewDetails(app)}>
                                                    <FaCheckCircle className="w-3 h-3" />
                                                    Paid
                                                </div>
                                            ) : (
                                                <div className="badge badge-warning badge-outline">
                                                    Unpaid
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => handleViewDetails(app)}
                                                className="btn btn-info btn-xs tooltip"
                                                data-tip="View Details"
                                            >
                                                <FaEye />
                                            </button>
                                            {app.status === 'approved' && app.applicationFeeStatus !== 'paid' && (
                                                <button
                                                    onClick={() => handlePayFee(app)}
                                                    className="btn btn-success btn-xs tooltip gap-1"
                                                    data-tip="Pay Application Fee"
                                                    disabled={processingPayment === app._id}
                                                >
                                                    {processingPayment === app._id ? (
                                                        <span className="loading loading-spinner loading-xs"></span>
                                                    ) : (
                                                        <FaCreditCard />
                                                    )}
                                                    Pay
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyLoans;
