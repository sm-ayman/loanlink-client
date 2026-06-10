import { useState, useEffect } from "react";
import { FaSearch, FaEye, FaEdit, FaTrash, FaPlus, FaHome, FaTag, FaPercent, FaDollarSign, FaHeading, FaImage } from "react-icons/fa";
import { loanAPI } from "../../../utils/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { uploadImage } from "../../../utils/imageUpload";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

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
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('category', data.category.toLowerCase());
            formData.append('interestRate', parseFloat(data.interestRate));
            formData.append('maxLoanLimit', parseFloat(data.maxLoanLimit));
            formData.append('description', data.description);
            formData.append('showOnHome', data.showOnHome === 'true' || data.showOnHome === true);

            // Handle images
            let imageUrls = editingLoan ? (editingLoan.images || []) : [];
            if (data.image && data.image.length > 0) {
                toast.loading(`Uploading ${data.image.length} image(s)...`, { id: 'upload' });
                for (let i = 0; i < data.image.length; i++) {
                    const photoURL = await uploadImage(data.image[i]);
                    imageUrls.push(photoURL);
                }
                toast.success('Images uploaded', { id: 'upload' });
            }
            
            imageUrls.forEach(url => {
                formData.append('images', url);
            });

            let response;
            if (editingLoan) {
                response = await loanAPI.updateLoan(editingLoan._id, formData);
            } else {
                response = await loanAPI.createLoan(formData);
            }

            if (response.success) {
                toast.success(`Loan ${editingLoan ? 'updated' : 'created'} successfully`);
                setIsModalOpen(false);
                loadLoans();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save loan', { id: 'upload' });
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
                <Button onClick={() => openModal()} variant="primary" icon={FaPlus} className="shadow-lg">
                    Create New Loan
                </Button>
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
            <LoanModal 
                loan={editingLoan} 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveLoan}
            />
        </div>
    );
};

const LoanModal = ({ loan, isOpen, onClose, onSave }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
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

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            reset(loan ? {
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
            });
        }
    }, [loan, isOpen, reset]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await onSave(data);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={() => !isSubmitting && onClose()}
            title={loan ? 'Edit Loan Program' : 'Create New Loan'}
            size="lg"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                        label="Title"
                        type="text" 
                        icon={FaHeading}
                        error={errors.title?.message}
                        disabled={isSubmitting}
                        {...register("title", { required: "Title is required" })}
                    />
                    <div className="flex flex-col w-full gap-1.5">
                        <label className="text-xs font-semibold tracking-wider text-brand-text/80 uppercase">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select 
                            className="select select-bordered w-full h-12 bg-brand-neutral/30 text-brand-text border-brand-border rounded-brand focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/40" 
                            disabled={isSubmitting}
                            {...register("category")}
                        >
                            <option value="personal">Personal</option>
                            <option value="business">Business</option>
                            <option value="home">Home</option>
                            <option value="vehicle">Vehicle</option>
                            <option value="education">Education</option>
                            <option value="emergency">Emergency</option>
                        </select>
                    </div>
                    <Input 
                        label="Max Amount ($)"
                        type="number" 
                        icon={FaDollarSign}
                        error={errors.maxLoanLimit?.message}
                        disabled={isSubmitting}
                        {...register("maxLoanLimit", { required: "Max limit is required", min: { value: 100, message: "Minimum is 100" } })}
                    />
                    <Input 
                        label="Interest Rate (%)"
                        type="number" 
                        step="0.1" 
                        icon={FaPercent}
                        error={errors.interestRate?.message}
                        disabled={isSubmitting}
                        {...register("interestRate", { required: "Interest rate is required", min: { value: 0, message: "Cannot be negative" } })}
                    />
                </div>

                <div className="flex flex-col w-full gap-1.5">
                    <label className="text-xs font-semibold tracking-wider text-brand-text/80 uppercase">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                        className={`
                            w-full px-4 py-3 text-sm bg-brand-neutral/30 text-brand-text border border-brand-border rounded-brand
                            transition-all duration-200 outline-none h-24 resize-none
                            focus:ring-2 focus:ring-brand-secondary/40 focus:border-brand-secondary focus:bg-brand-card
                            disabled:opacity-50 disabled:bg-brand-neutral/10 disabled:pointer-events-none
                            ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
                        `} 
                        disabled={isSubmitting}
                        {...register("description", { required: "Description is required" })}
                    ></textarea>
                    {errors.description && <span className="text-xs text-red-500 font-medium">{errors.description.message}</span>}
                </div>

                <div className="flex flex-col w-full gap-1.5">
                    <label className="text-xs font-semibold tracking-wider text-brand-text/80 uppercase">
                        Loan Images (Optional)
                    </label>
                    <input 
                        type="file" 
                        multiple
                        className="file-input file-input-bordered w-full h-12 text-sm bg-brand-neutral/30 text-brand-text border-brand-border rounded-brand focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/40" 
                        accept="image/*"
                        disabled={isSubmitting}
                        {...register("image")} 
                    />
                </div>

                <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-3">
                        <input type="checkbox" className="checkbox checkbox-primary" disabled={isSubmitting} {...register("showOnHome")} />
                        <span className="label-text font-bold">Show this loan program on Home Page</span>
                    </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-brand-border mt-6">
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        variant="primary" 
                        isLoading={isSubmitting}
                        className="shadow-lg shadow-brand-primary/30"
                    >
                        {loan ? 'Update Loan' : 'Create Loan'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default AllLoansAdmin;
