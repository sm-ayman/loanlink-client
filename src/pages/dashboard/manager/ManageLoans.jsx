import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loanAPI } from "../../../utils/api";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaEye, FaSearch, FaPlus, FaImage, FaFileAlt, FaPercent } from "react-icons/fa";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const ManageLoans = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch manager's loans
  const { data: loansData, isLoading, error, refetch } = useQuery({
    queryKey: ['manager-loans', searchTerm, selectedCategory],
    queryFn: () => loanAPI.getMyLoans(),
  });

  // Delete loan mutation
  const deleteMutation = useMutation({
    mutationFn: (loanId) => loanAPI.deleteLoan(loanId),
    onSuccess: () => {
      toast.success("Loan deleted successfully!");
      queryClient.invalidateQueries(['manager-loans']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete loan");
    }
  });

  // Filter loans based on search and category
  const filteredLoans = loansData?.data?.loans?.filter(loan => {
    const matchesSearch = !searchTerm ||
      loan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || loan.category === selectedCategory;

    return matchesSearch && matchesCategory;
  }) || [];

  const handleDelete = async (loan) => {
    const result = await Swal.fire({
      title: 'Delete Loan?',
      html: `
        <div class="text-left">
          <p><strong>Loan:</strong> ${loan.title}</p>
          <p><strong>Category:</strong> ${loan.category}</p>
          <p><strong>Max Limit:</strong> $${loan.maxLoanLimit}</p>
          <p class="text-red-600 mt-2">This action cannot be undone!</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(loan._id);
    }
  };

  const handleViewDetails = (loan) => {
    Swal.fire({
      title: loan.title,
      html: `
        <div class="text-left space-y-3 max-h-96 overflow-y-auto">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-bold text-lg mb-3">Loan Information</h3>
            <p><strong>Description:</strong> ${loan.description}</p>
            <p><strong>Category:</strong> ${loan.category}</p>
            <p><strong>Interest Rate:</strong> ${loan.interestRate}%</p>
            <p><strong>Max Loan Limit:</strong> $${loan.maxLoanLimit}</p>
            <p><strong>Show on Home:</strong> ${loan.showOnHome ? 'Yes' : 'No'}</p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-bold text-lg mb-3">Requirements</h3>
            <ul class="list-disc list-inside space-y-1">
              ${loan.requiredDocuments?.map(doc => `<li>${doc}</li>`).join('') || 'None specified'}
            </ul>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-bold text-lg mb-3">EMI Plans</h3>
            <ul class="list-disc list-inside space-y-1">
              ${loan.emiPlans?.map(plan => `<li>${plan}</li>`).join('') || 'None specified'}
            </ul>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-bold text-lg mb-3">Images</h3>
            <p>${loan.images?.length || 0} image(s) uploaded</p>
          </div>
        </div>
      `,
      width: '600px',
      showCloseButton: true,
      showConfirmButton: false
    });
  };

  const handleEdit = (loan) => {
    setEditingLoan(loan);
    setShowAddModal(true);
  };

  // Get unique categories for filter dropdown
  const categories = [...new Set(loansData?.data?.loans?.map(loan => loan.category) || [])];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-error text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-error mb-2">Error Loading Loans</h2>
        <p className="text-gray-600">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Manage My Loans</h1>
          <p className="text-gray-600 mt-1">Create, update, and manage your loan offerings</p>
        </div>
        <button
          onClick={() => {
            navigate('/dashboard/add-loan');
          }}
          className="btn btn-primary gap-2"
        >
          <FaPlus />
          Add New Loan
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-base-100 p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="input input-bordered flex items-center gap-2">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search loans by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="grow"
              />
            </label>
          </div>
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredLoans.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            {loansData?.data?.loans?.length === 0 ? 'No Loans Created' : 'No Loans Match Your Search'}
          </h2>
          <p className="text-gray-500 mb-4">
            {loansData?.data?.loans?.length === 0
              ? 'Start by creating your first loan offering'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
          {loansData?.data?.loans?.length === 0 && (
            <button
              onClick={() => {
                navigate('/dashboard/add-loan');
              }}
              className="btn btn-primary"
            >
              Create Your First Loan
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLoans.map((loan) => (
            <div key={loan._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <figure className="h-48">
                {loan.images && loan.images.length > 0 ? (
                  <img
                    src={loan.images[0]}
                    alt={loan.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-loan.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <FaImage className="text-4xl text-gray-400" />
                  </div>
                )}
              </figure>
              <div className="card-body">
                <h2 className="card-title text-lg">{loan.title}</h2>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${loan.showOnHome ? 'badge-primary' : 'badge-ghost'}`}>
                    {loan.showOnHome ? 'Featured' : 'Hidden'}
                  </span>
                  <span className="badge badge-outline">{loan.category}</span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FaPercent className="text-primary" />
                    <span>{loan.interestRate}% Interest</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaFileAlt className="text-primary" />
                    <span>Up to ${loan.maxLoanLimit.toLocaleString()}</span>
                  </div>
                </div>

                <div className="card-actions justify-end">
                  <button
                    onClick={() => handleViewDetails(loan)}
                    className="btn btn-info btn-sm gap-1"
                  >
                    <FaEye />
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(loan)}
                    className="btn btn-warning btn-sm gap-1"
                  >
                    <FaEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(loan)}
                    className="btn btn-error btn-sm gap-1"
                    disabled={deleteMutation.isLoading}
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Loan Modal */}
      {showAddModal && editingLoan && (
        <EditLoanModal 
            loan={editingLoan} 
            onClose={() => {
                setShowAddModal(false);
                setEditingLoan(null);
            }} 
            onSuccess={() => {
                queryClient.invalidateQueries(['manager-loans']);
            }} 
        />
      )}
    </div>
  );
};

const EditLoanModal = ({ loan, onClose, onSuccess }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: loan.title,
      category: loan.category.charAt(0).toUpperCase() + loan.category.slice(1),
      interestRate: loan.interestRate,
      maxAmount: loan.maxLoanLimit,
      description: loan.description,
      showOnHome: loan.showOnHome
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => loanAPI.updateLoan(loan._id, data),
    onSuccess: () => {
      toast.success("Loan updated successfully!");
      onSuccess();
      onClose();
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.errors 
        ? error.response.data.errors.map(e => e.message).join(' | ')
        : error.response?.data?.message || "Failed to update loan";
      toast.error(errorMsg);
    }
  });

  const onSubmit = (data) => {
    const loanData = {
      title: data.title,
      category: data.category.toLowerCase(),
      interestRate: parseFloat(data.interestRate),
      maxLoanLimit: parseFloat(data.maxAmount),
      description: data.description,
      showOnHome: data.showOnHome === 'true' || data.showOnHome === true
    };
    updateMutation.mutate(loanData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 overflow-y-auto">
      <div className="bg-base-100 rounded-lg shadow-2xl w-full max-w-2xl p-6 my-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Loan</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Title</span></label>
              <input type="text" className="input input-bordered w-full" {...register("title", { required: true })} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Category</span></label>
              <select className="select select-bordered w-full" {...register("category", { required: true })}>
                <option value="Personal">Personal</option>
                <option value="Business">Business</option>
                <option value="Education">Education</option>
                <option value="Home">Home</option>
                <option value="Vehicle">Vehicle</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Interest Rate (%)</span></label>
              <input type="number" step="0.01" className="input input-bordered w-full" {...register("interestRate", { required: true })} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Max Limit ($)</span></label>
              <input type="number" className="input input-bordered w-full" {...register("maxAmount", { required: true })} />
            </div>
          </div>
          <div className="form-control mt-4">
            <label className="label"><span className="label-text">Description</span></label>
            <textarea className="textarea textarea-bordered h-24" {...register("description", { required: true })}></textarea>
          </div>
          <div className="form-control mt-4 w-fit">
            <label className="cursor-pointer label gap-4">
              <span className="label-text">Show on Home Page?</span>
              <input type="checkbox" className="toggle toggle-primary" {...register("showOnHome")} />
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageLoans;