import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

const AllLoansAdmin = () => {
    const axiosPublic = useAxiosPublic();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLoan, setEditingLoan] = useState(null);

    // STATIC MOCK DATA
    const [loans, setLoans] = useState([
        { _id: '1', title: "Personal Loan", category: "Personal", maxAmount: 5000, interestRate: 5, description: "Low interest personal loan" },
        { _id: '2', title: "Business Startup", category: "Business", maxAmount: 50000, interestRate: 8, description: "Fund your new business" },
        { _id: '3', title: "Home Renovation", category: "Home", maxAmount: 25000, interestRate: 4.5, description: "Improve your living space" },
        { _id: '4', title: "Vehicle Finance", category: "Vehicle", maxAmount: 15000, interestRate: 6, description: "Get your dream car" },
        { _id: '5', title: "Education Loan", category: "Education", maxAmount: 10000, interestRate: 3, description: "Invest in your future" },
    ]);
    const isLoading = false;

    // Delete Mock
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setLoans(loans.filter(loan => loan._id !== id));
                Swal.fire('Deleted!', 'The loan has been deleted.', 'success');
            }
        });
    };

    const handleSaveLoan = (data) => {
        if (editingLoan) {
            // Edit existing
            setLoans(loans.map(l => l._id === editingLoan._id ? { ...l, ...data } : l));
            Swal.fire('Success!', 'Loan updated successfully.', 'success');
        } else {
            // Create new
            const newLoan = { ...data, _id: Date.now().toString() };
            setLoans([...loans, newLoan]);
            Swal.fire('Success!', 'Loan created successfully.', 'success');
        }
        setIsModalOpen(false);
    };

    const openModal = (loan = null) => {
        setEditingLoan(loan);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6 bg-base-100 h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-primary">All Loans Management</h1>
                <button onClick={() => openModal()} className="btn btn-primary gap-2">
                    <FaPlus /> Create New Loan
                </button>
            </div>
            
            {/* Search */}
            <div className="flex justify-between items-center mb-6 gap-4">
                <div className="input-group w-full md:w-auto">
                    <input 
                        type="text" 
                        placeholder="Search loans..." 
                        className="input input-bordered w-full md:w-64" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-square">
                        <FaSearch />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-base-200">
                <table className="table w-full">
                    <thead className="bg-base-200">
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Max Amount</th>
                            <th>Interest Rate</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                        ) : loans.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-4">No loans found</td></tr>
                        ) : (
                            loans.map((loan, index) => (
                                <tr key={loan._id}>
                                    <td>{index + 1}</td>
                                    <td className="font-bold">{loan.title}</td>
                                    <td><span className="badge badge-ghost">{loan.category}</span></td>
                                    <td>${loan.maxAmount?.toLocaleString()}</td>
                                    <td>{loan.interestRate}%</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button onClick={() => openModal(loan)} className="btn btn-xs btn-info btn-outline" title="Edit">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => handleDelete(loan._id)} className="btn btn-xs btn-error btn-outline" title="Delete">
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

// Sub-component for Add/Edit Modal
const LoanModal = ({ loan, isOpen, onClose, onSave }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: loan || {
            title: '',
            category: 'Personal',
            description: '',
            maxAmount: 10000,
            interestRate: 5,
            image: ''
        }
    });

    const onSubmit = (data) => {
        onSave(data);
    };

    return (
        <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box w-11/12 max-w-3xl">
                <h3 className="font-bold text-lg mb-4">{loan ? 'Edit Loan' : 'Create New Loan'}</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label">Title</label>
                        <input type="text" className="input input-bordered" {...register("title", { required: true })} />
                    </div>
                    <div className="form-control">
                        <label className="label">Category</label>
                        <select className="select select-bordered" {...register("category")}>
                            <option>Personal</option>
                            <option>Business</option>
                            <option>Home</option>
                            <option>Vehicle</option>
                            <option>Education</option>
                        </select>
                    </div>
                    <div className="form-control">
                        <label className="label">Max Amount ($)</label>
                        <input type="number" className="input input-bordered" {...register("maxAmount", { required: true, min: 1 })} />
                    </div>
                     <div className="form-control">
                        <label className="label">Interest Rate (%)</label>
                        <input type="number" step="0.1" className="input input-bordered" {...register("interestRate", { required: true, min: 0 })} />
                    </div>
                    <div className="form-control md:col-span-2">
                        <label className="label">Image URL</label>
                        <input type="text" className="input input-bordered" {...register("image")} placeholder="https://..." />
                    </div>
                    <div className="form-control md:col-span-2">
                        <label className="label">Description</label>
                        <textarea className="textarea textarea-bordered h-24" {...register("description", { required: true })}></textarea>
                    </div>

                    <div className="modal-action md:col-span-2">
                        <button type="button" className="btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">
                            {loan ? 'Update Loan' : 'Create Loan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AllLoansAdmin;
