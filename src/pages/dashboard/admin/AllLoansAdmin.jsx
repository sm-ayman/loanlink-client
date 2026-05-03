import { useState, useEffect } from "react";
import { FaSearch, FaEye, FaEdit, FaTrash, FaPlus, FaHome } from "react-icons/fa";
import { loanAPI } from "../../../utils/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

const AllLoansAdmin = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLoan, setEditingLoan] = useState(null);

    const loadLoans = async () => {
        try {
            setLoading(true);
            const params = { search: searchTerm };
            const response = await loanAPI.getAllLoans(params);
            if (response.success) {
                setLoans(response.data.loans);
            }
        } catch (error) {
            console.error('Error loading loans:', error);
            toast.error('Failed to load loans');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(loadLoans, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await loanAPI.deleteLoan(id);
                if (response.success) {
                    toast.success('Loan deleted successfully');
                    loadLoans();
                }
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete loan');
            }
        }
    };

    const handleToggleHome = async (loan) => {
        try {
            const response = await loanAPI.updateLoan(loan._id, { showOnHome: !loan.showOnHome });
            if (response.success) {
                toast.success(`Loan ${!loan.showOnHome ? 'added to' : 'removed from'} home page`);
                loadLoans();
            }
        } catch (err) {
            toast.error('Failed to update home page status');
        }
    };

    const handleSaveLoan = async (data) => {
        try {
            let response;
            if (editingLoan) {
                response = await loanAPI.updateLoan(editingLoan._id, data);
            } else {
                response = await loanAPI.createLoan(data);
            }

            if (response.success) {
                toast.success(`Loan ${editingLoan ? 'updated' : 'created'} successfully`);
                setIsModalOpen(false);
                loadLoans();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save loan');
        }
    };

    const openModal = (loan = null) => {
        setEditingLoan(loan);
        setIsModalOpen(true);
    };

    const getImageUrl = (image) => {
        if (!image) return "https://via.placeholder.com/150?text=No+Image";
        if (image.startsWith('http')) return image;
        return `${import.meta.env.VITE_API_URL?.replace('/api', '')}/uploads/${image}`;
    };

    return (
        <div className="p-6 bg-base-100 min-h-full">
            <Helmet>
                <title>Manage All Loans | Admin</title>
            </Helmet>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <FaHome className="text-primary" /> All Loans Management
                    </h1>
                    <p className="opacity-70 mt-1">Manage all available loan programs across the system.</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary shadow-lg">
                    <FaPlus /> Create New Loan
                </button>
            </div>
            
            {/* Search and Stats */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1">
                    <label className="input input-bordered flex items-center gap-2 shadow-sm">
                        <FaSearch className="text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by title or category..." 
                            className="grow" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </label>
                </div>
                <div className="flex gap-4">
                    <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                        Total: {loans.length}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-base-100 shadow-xl rounded-2xl border border-base-200">
                <table className="table w-full">
                    <thead className="bg-base-200">
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Title & Category</th>
                            <th>Interest</th>
                            <th>Created By</th>
                            <th>Home Page</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="text-center py-20">
                                    <span className="loading loading-spinner loading-lg text-primary"></span>
                                </td>
                            </tr>
                        ) : loans.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-20">
                                    <div className="opacity-40 italic">No loans found in the system.</div>
                                </td>
                            </tr>
                        ) : (
                            loans.map((loan, index) => (
                                <tr key={loan._id} className="hover:bg-base-200 transition-colors">
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="avatar">
                                            <div className="w-16 h-10 rounded-lg shadow-sm">
                                                <img src={getImageUrl(loan.images?.[0])} alt={loan.title} className="object-cover" />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <div className="font-bold text-lg">{loan.title}</div>
                                            <div className="badge badge-sm badge-outline badge-primary uppercase">{loan.category}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-semibold text-primary">{loan.interestRate}%</div>
                                        <div className="text-xs opacity-50">Max: ${loan.maxLoanLimit?.toLocaleString()}</div>
                                    </td>
                                    <td>
                                        <div className="text-sm font-medium">{loan.createdBy?.name || 'Unknown'}</div>
                                        <div className="text-xs opacity-50">{loan.createdBy?.email}</div>
                                    </td>
                                    <td>
                                        <div className="form-control">
                                            <label className="label cursor-pointer justify-start gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    className="toggle toggle-primary toggle-sm" 
                                                    checked={loan.showOnHome} 
                                                    onChange={() => handleToggleHome(loan)}
                                                />
                                                <span className={`text-xs font-bold ${loan.showOnHome ? 'text-primary' : 'text-gray-400'}`}>
                                                    {loan.showOnHome ? 'VISIBLE' : 'HIDDEN'}
                                                </span>
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex gap-1">
                                            <button onClick={() => openModal(loan)} className="btn btn-sm btn-circle btn-ghost text-info tooltip" data-tip="Edit Loan">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => handleDelete(loan._id)} className="btn btn-sm btn-circle btn-ghost text-error tooltip" data-tip="Delete Loan">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <LoanModal 
                    loan={editingLoan} 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={handleSaveLoan}
                />
            )}
        </div>
    );
};

const LoanModal = ({ loan, isOpen, onClose, onSave }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: loan ? {
            ...loan,
            interestRate: loan.interestRate,
            maxLoanLimit: loan.maxLoanLimit
        } : {
            title: '',
            category: 'personal',
            description: '',
            maxLoanLimit: 10000,
            interestRate: 5,
            showOnHome: false
        }
    });

    const onSubmit = (data) => {
        onSave(data);
    };

    return (
        <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box w-11/12 max-w-2xl p-8 rounded-2xl shadow-2xl bg-base-100 text-base-content">
                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
                <h3 className="font-bold text-2xl mb-6 text-primary flex items-center gap-2">
                    {loan ? <FaEdit /> : <FaPlus />} {loan ? 'Edit Loan Program' : 'Create New Loan'}
                </h3>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label font-semibold">Title</label>
                            <input type="text" className="input input-bordered focus:input-primary" {...register("title", { required: "Title is required" })} />
                            {errors.title && <span className="text-error text-xs mt-1">{errors.title.message}</span>}
                        </div>
                        <div className="form-control">
                            <label className="label font-semibold">Category</label>
                            <select className="select select-bordered focus:select-primary" {...register("category")}>
                                <option value="personal">Personal</option>
                                <option value="business">Business</option>
                                <option value="home">Home</option>
                                <option value="vehicle">Vehicle</option>
                                <option value="education">Education</option>
                                <option value="emergency">Emergency</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label font-semibold">Max Amount ($)</label>
                            <input type="number" className="input input-bordered focus:input-primary" {...register("maxLoanLimit", { required: true, min: 100 })} />
                        </div>
                        <div className="form-control">
                            <label className="label font-semibold">Interest Rate (%)</label>
                            <input type="number" step="0.1" className="input input-bordered focus:input-primary" {...register("interestRate", { required: true, min: 0 })} />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label font-semibold">Description</label>
                        <textarea className="textarea textarea-bordered h-24 focus:textarea-primary" {...register("description", { required: "Description is required" })}></textarea>
                        {errors.description && <span className="text-error text-xs mt-1">{errors.description.message}</span>}
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3">
                            <input type="checkbox" className="checkbox checkbox-primary" {...register("showOnHome")} />
                            <span className="label-text font-bold">Show this loan program on Home Page</span>
                        </label>
                    </div>

                    <div className="modal-action">
                        <button type="button" className="btn btn-ghost px-8" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary px-8 shadow-lg shadow-primary/30">
                            {loan ? 'Update Loan' : 'Create Loan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AllLoansAdmin;
