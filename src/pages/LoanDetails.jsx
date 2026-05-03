import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import SectionTitle from "../components/shared/SectionTitle";
import { FaCheckCircle, FaMoneyBillWave, FaClock, FaFileAlt } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import LoanApplicationForm from "../components/loans/LoanApplicationForm";
import { loanAPI, applicationAPI } from '../utils/api';
import toast from "react-hot-toast";
import { useForm } from 'react-hook-form';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const LoanDetails = () => {
    const { id } = useParams();
    const { user, backendUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const { register, handleSubmit, reset } = useForm();

    const [loan, setLoan] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowSize();

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchLoan = async () => {
            try {
                setIsLoading(true);
                const response = await loanAPI.getLoanById(id);
                if (response.success) {
                    setLoan(response.data.loan);
                }
            } catch (err) {
                console.error("Failed to fetch loan details", err);
                toast.error("Failed to load loan details");
            } finally {
                setIsLoading(false);
            }
        };
        fetchLoan();
    }, [id]);

    const isAdminOrManager = backendUser?.role === 'admin' || backendUser?.role === 'manager';
    const canApply = user && !isAdminOrManager;

    const onSubmit = async (data) => {
        try {
            const applicationData = {
                ...data,
                loanId: id,
                loanTitle: loan.title,
                interestRate: loan.interestRate,
                userEmail: user.email
            };
            const response = await applicationAPI.submitApplication(applicationData);
            if (response.success) {
                toast.success('Application submitted successfully!');
                document.getElementById('apply_modal').close();
                setShowConfetti(true);
                
                setTimeout(() => {
                    setShowConfetti(false);
                    reset();
                    navigate('/dashboard/my-loans');
                }, 4000);
            }
        } catch (err) {
            console.error("Failed to submit application", err);
            toast.error(err.response?.data?.message || "Failed to submit application");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!loan) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center gap-4">
                <h2 className="text-3xl font-bold text-error">Loan Not Found</h2>
                <Link to="/all-loans" className="btn btn-primary">Back to All Loans</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 py-10 px-4">
            {showConfetti && <Confetti width={width} height={height} numberOfPieces={300} gravity={0.15} style={{ zIndex: 9999, position: 'fixed', top: 0, left: 0 }} />}
            <div className="max-w-4xl mx-auto bg-base-100 rounded-2xl shadow-xl overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2 h-64 md:h-auto">
                        <img 
                            src={loan.images?.[0] || loan.image || "https://via.placeholder.com/600x400?text=Loan+Image"} 
                            alt={loan.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="md:w-1/2 p-8">
                        <div className="badge badge-secondary mb-2">{loan.category}</div>
                        <h1 className="text-3xl font-bold mb-4">{loan.title}</h1>
                        <p className="text-gray-600 mb-6">{loan.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-base-200 p-3 rounded-lg text-center">
                                <p className="text-xs uppercase text-gray-500 font-bold">Interest Rate</p>
                                <p className="text-xl font-bold text-primary">{loan.interestRate}%</p>
                            </div>
                            <div className="bg-base-200 p-3 rounded-lg text-center">
                                <p className="text-xs uppercase text-gray-500 font-bold">Max Limit</p>
                                <p className="text-xl font-bold text-primary">${loan.maxLoanLimit?.toLocaleString()}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold mb-2">Available EMI Plans:</h3>
                            <div className="flex flex-wrap gap-2 mb-8">
                                {loan.emiPlans?.map(plan => (
                                    <span key={plan} className="badge badge-outline">{plan}</span>
                                ))}
                            </div>
                        </div>

                        {canApply ? (
                            <button 
                                onClick={() => document.getElementById('apply_modal').showModal()}
                                className="btn btn-primary w-full shadow-lg"
                            >
                                Apply Now
                            </button>
                        ) : (
                            !user ? (
                                <Link to="/login" className="btn btn-outline btn-primary w-full">Login to Apply</Link>
                            ) : (
                                <div className="alert alert-info">
                                    <span>Admins and Managers cannot apply for loans.</span>
                                </div>
                            )
                        )}
                    </div>
                </div>

                <div className="p-8 border-t border-base-200">
                    <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {loan.requiredDocuments?.map(doc => (
                            <li key={doc}>{doc}</li>
                        )) || (
                            <>
                                <li>Valid National ID or Passport</li>
                                <li>Proof of Income (Last 3 months)</li>
                                <li>Proof of Address (Utility bill)</li>
                            </>
                        )}
                    </ul>
                </div>
            </div>

            {/* Application Modal */}
            <dialog id="apply_modal" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <h3 className="font-bold text-2xl mb-6">Loan Application Form</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* READ-ONLY FIELDS */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Your Email</span></label>
                            <input type="email" value={user?.email || ''} readOnly className="input input-bordered bg-base-200" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Loan Title</span></label>
                            <input type="text" value={loan.title} readOnly className="input input-bordered bg-base-200" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Interest Rate (%)</span></label>
                            <input type="text" value={loan.interestRate} readOnly className="input input-bordered bg-base-200" />
                        </div>

                        {/* USER INPUT FIELDS */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">First Name</span></label>
                            <input type="text" {...register("firstName", { required: true })} className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Last Name</span></label>
                            <input type="text" {...register("lastName", { required: true })} className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Contact Number</span></label>
                            <input type="text" {...register("contactNumber", { required: true })} className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">National ID / Passport</span></label>
                            <input type="text" {...register("identityNumber", { required: true })} className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Income Source</span></label>
                            <input type="text" {...register("incomeSource", { required: true })} className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Monthly Income ($)</span></label>
                            <input type="number" {...register("monthlyIncome", { required: true })} className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Requested Loan Amount ($)</span></label>
                            <input type="number" {...register("requestedAmount", { required: true, max: loan.maxLoanLimit })} className="input input-bordered" />
                        </div>
                        <div className="form-control md:col-span-2">
                            <label className="label"><span className="label-text">Reason for Loan</span></label>
                            <textarea {...register("loanReason", { required: true })} className="textarea textarea-bordered h-24" placeholder="Briefly explain why you need this loan"></textarea>
                        </div>
                        <div className="form-control md:col-span-2">
                            <label className="label"><span className="label-text">Address</span></label>
                            <input type="text" {...register("address", { required: true })} className="input input-bordered" />
                        </div>
                        <div className="form-control md:col-span-2">
                            <label className="label"><span className="label-text">Extra Notes (Optional)</span></label>
                            <input type="text" {...register("extraNotes")} className="input input-bordered" />
                        </div>

                        <div className="modal-action md:col-span-2">
                            <button type="submit" className="btn btn-primary px-10">Submit Application</button>
                            <button type="button" onClick={() => document.getElementById('apply_modal').close()} className="btn">Cancel</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default LoanDetails;
