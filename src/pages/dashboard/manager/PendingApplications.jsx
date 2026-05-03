import { useState, useEffect } from "react";
import { FaEye, FaCheck, FaTimes, FaCalendar, FaUser, FaMoneyBillWave } from "react-icons/fa";
import { applicationAPI } from "../../../utils/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const PendingApplications = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalApplications, setTotalApplications] = useState(0);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: limit
      };
      const response = await applicationAPI.getPendingApplications(params);
      if (response.success) {
        setApplications(response.data.applications);
        setTotalApplications(response.data.pagination.totalApplications);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [currentPage]);

  const handleApprove = async (application) => {
    const result = await Swal.fire({
      title: 'Approve Application?',
      text: `Are you sure you want to approve the application for ${application.userId?.email}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Yes, Approve',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await applicationAPI.approveApplication(application._id);
        if (response.success) {
          toast.success("Application approved successfully!");
          loadApplications();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to approve application");
      }
    }
  };

  const handleReject = async (application) => {
    const result = await Swal.fire({
      title: 'Reject Application?',
      text: `Are you sure you want to reject the application for ${application.userId?.email}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Reject Application',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await applicationAPI.rejectApplication(application._id);
        if (response.success) {
          toast.success("Application rejected successfully!");
          loadApplications();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to reject application");
      }
    }
  };

  const handleViewDetails = (application) => {
    Swal.fire({
      title: 'Application Details',
      html: `
        <div class="text-left space-y-3 max-h-96 overflow-y-auto">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-bold text-lg mb-3">Applicant Information</h3>
            <p><strong>Name:</strong> ${application.firstName} ${application.lastName}</p>
            <p><strong>Email:</strong> ${application.userId?.email || 'N/A'}</p>
            <p><strong>Contact:</strong> ${application.contactNumber}</p>
            <p><strong>National ID:</strong> ${application.nationalId}</p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-bold text-lg mb-3">Loan Information</h3>
            <p><strong>Loan:</strong> ${application.loanId?.title || 'N/A'}</p>
            <p><strong>Category:</strong> ${application.loanId?.category || 'N/A'}</p>
            <p><strong>Requested Amount:</strong> $${application.loanAmount?.toLocaleString()}</p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-bold text-lg mb-3">Financial Information</h3>
            <p><strong>Income Source:</strong> ${application.incomeSource}</p>
            <p><strong>Monthly Income:</strong> $${application.monthlyIncome?.toLocaleString()}</p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-bold text-lg mb-3">Application Details</h3>
            <p><strong>Reason:</strong> ${application.reasonForLoan}</p>
            <p><strong>Address:</strong> ${application.address}</p>
            ${application.extraNotes ? `<p><strong>Extra Notes:</strong> ${application.extraNotes}</p>` : ''}
            <p><strong>Applied Date:</strong> ${new Date(application.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      `,
      width: '600px',
      showCloseButton: true,
      showConfirmButton: false
    });
  };

  const totalPages = Math.ceil(totalApplications / limit);
  const pagination = {
    currentPage,
    totalPages,
    totalApplications,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
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
          <h1 className="text-3xl font-bold text-primary">Pending Applications</h1>
          <p className="opacity-70 mt-1">Review and manage loan applications awaiting approval</p>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <FaCalendar className="inline-block w-8 h-8 stroke-current" />
            </div>
            <div className="stat-title">Total Pending</div>
            <div className="stat-value text-primary">{pagination.totalApplications || 0}</div>
          </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold mb-2">No Pending Applications</h2>
          <p className="opacity-60">All applications have been reviewed</p>
        </div>
      ) : (
        <>
          <div className="bg-base-100 shadow-xl rounded-lg overflow-hidden border border-base-200">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead className="bg-base-200">
                  <tr>
                    <th className="w-16">#</th>
                    <th>Loan ID</th>
                    <th>Applicant</th>
                    <th>Loan Details</th>
                    <th>Amount</th>
                    <th>Applied Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                                {applications.map((application, index) => (
                    <tr key={application._id} className="hover">
                      <td className="font-medium">
                        {(currentPage - 1) * limit + index + 1}
                      </td>
                      <td className="font-mono text-sm opacity-70">
                        {application._id.slice(-8).toUpperCase()}
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar avatar-sm">
                            <div className="w-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <FaUser className="w-4 h-4 text-primary" />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">{application.userId?.name}</div>
                            <div className="text-sm opacity-60">{application.userId?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">{application.loanId?.title}</div>
                          <div className="text-sm opacity-60">{application.loanId?.category}</div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <FaMoneyBillWave className="text-green-500" />
                          <span className="font-semibold">${application.loanAmount?.toLocaleString()}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <FaCalendar className="opacity-40" />
                          <span className="text-sm">
                            {new Date(application.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleViewDetails(application)}
                            className="btn btn-info btn-xs tooltip"
                            data-tip="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleApprove(application)}
                            className="btn btn-success btn-xs tooltip"
                            data-tip="Approve"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleReject(application)}
                            className="btn btn-error btn-xs tooltip"
                            data-tip="Reject"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="join">
                <button
                  className="join-item btn btn-sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`join-item btn btn-sm ${page === currentPage ? 'btn-active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="join-item btn btn-sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                  disabled={currentPage === pagination.totalPages}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PendingApplications;