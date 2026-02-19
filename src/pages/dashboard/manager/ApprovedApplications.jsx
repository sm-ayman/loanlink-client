import { useState, useEffect } from "react";
import { FaEye, FaCalendar, FaUser, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";

const ApprovedApplications = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load applications data
  useEffect(() => {
    const loadApplications = async () => {
      try {
        const response = await fetch('/applications.json');
        const applicationsData = await response.json();
        setApplications(applicationsData);
      } catch (error) {
        console.error('Error loading applications:', error);
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, []);

  const handleViewDetails = (application) => {
    Swal.fire({
      title: 'Approved Application Details',
      html: `
        <div class="text-left space-y-3 max-h-96 overflow-y-auto">
          <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <div class="flex items-center gap-2 mb-2">
              <FaCheckCircle class="text-green-500" />
              <span class="font-bold text-green-700">Application Approved</span>
            </div>
            <p class="text-sm text-green-600">Approved on ${new Date(application.approvedAt).toLocaleDateString()}</p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-bold text-lg mb-3">Applicant Information</h3>
            <p><strong>Name:</strong> ${application.firstName} ${application.lastName}</p>
            <p><strong>Email:</strong> ${application.userId.email}</p>
            <p><strong>Contact:</strong> ${application.contactNumber}</p>
            <p><strong>National ID:</strong> ${application.nationalId}</p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-bold text-lg mb-3">Loan Information</h3>
            <p><strong>Loan:</strong> ${application.loanId.title}</p>
            <p><strong>Category:</strong> ${application.loanId.category}</p>
            <p><strong>Interest Rate:</strong> ${application.loanId.interestRate}%</p>
            <p><strong>Approved Amount:</strong> $${application.loanAmount}</p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-bold text-lg mb-3">Financial Information</h3>
            <p><strong>Income Source:</strong> ${application.incomeSource}</p>
            <p><strong>Monthly Income:</strong> $${application.monthlyIncome}</p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-bold text-lg mb-3">Application Details</h3>
            <p><strong>Reason:</strong> ${application.reasonForLoan}</p>
            <p><strong>Address:</strong> ${application.address}</p>
            ${application.extraNotes ? `<p><strong>Extra Notes:</strong> ${application.extraNotes}</p>` : ''}
            <p><strong>Applied Date:</strong> ${new Date(application.createdAt).toLocaleDateString()}</p>
          </div>

          <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 class="font-bold text-lg mb-2">Next Steps</h3>
            <p class="text-blue-700">The applicant needs to pay the $10 application fee to complete the process.</p>
            <p class="text-sm text-blue-600 mt-1">Payment Status: ${application.applicationFeeStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}</p>
          </div>
        </div>
      `,
      width: '600px',
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'swal-wide'
      }
    });
  };

  // Filter approved applications
  const approvedApplications = applications.filter(app => app.status === 'approved');

  // Pagination logic
  const totalApplications = approvedApplications.length;
  const totalPages = Math.ceil(totalApplications / limit);
  const startIndex = (currentPage - 1) * limit;
  const paginatedApplications = approvedApplications.slice(startIndex, startIndex + limit);

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
          <h1 className="text-3xl font-bold text-primary">Approved Applications</h1>
          <p className="text-gray-600 mt-1">Track approved loan applications and their payment status</p>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-success">
              <FaCheckCircle className="inline-block w-8 h-8 stroke-current" />
            </div>
            <div className="stat-title">Total Approved</div>
            <div className="stat-value text-success">{pagination.totalApplications || 0}</div>
          </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Approved Applications</h2>
          <p className="text-gray-500">Approved applications will appear here</p>
        </div>
      ) : (
        <>
          <div className="bg-base-100 shadow-xl rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead className="bg-base-200">
                  <tr>
                    <th className="w-16">#</th>
                    <th>Loan ID</th>
                    <th>Applicant</th>
                    <th>Loan Details</th>
                    <th>Amount</th>
                    <th>Approved Date</th>
                    <th>Payment Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                                {paginatedApplications.map((application, index) => (
                    <tr key={application._id} className="hover">
                      <td className="font-medium">
                        {(currentPage - 1) * limit + index + 1}
                      </td>
                      <td className="font-mono text-sm">
                        {application._id.slice(-8).toUpperCase()}
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar avatar-sm">
                            <div className="w-8 rounded-full bg-success/20 flex items-center justify-center">
                              <FaUser className="w-4 h-4 text-success" />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">{application.userId.name}</div>
                            <div className="text-sm text-gray-500">{application.userId.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">{application.loanId.title}</div>
                          <div className="text-sm text-gray-500">{application.loanId.category}</div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <FaMoneyBillWave className="text-green-500" />
                          <span className="font-semibold">${application.loanAmount}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <FaCalendar className="text-success" />
                          <span className="text-sm">
                            {new Date(application.approvedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center justify-center">
                          {application.applicationFeeStatus === 'paid' ? (
                            <div className="badge badge-success badge-outline gap-1">
                              <FaCheckCircle className="w-3 h-3" />
                              Paid
                            </div>
                          ) : (
                            <div className="badge badge-warning badge-outline">
                              Pending
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleViewDetails(application)}
                            className="btn btn-info btn-xs tooltip"
                            data-tip="View Details"
                          >
                            <FaEye />
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

export default ApprovedApplications;