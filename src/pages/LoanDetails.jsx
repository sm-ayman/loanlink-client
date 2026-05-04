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
    const { register, handleSubmit, reset, trigger, getValues, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
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

    const getImageUrl = (img) => {
        if (!img) return "https://via.placeholder.com/600x400?text=Loan+Image";
        if (img.startsWith('http')) return img;
        return `${import.meta.env.VITE_API_URL?.replace('/api', '')}/uploads/${img}`;
    };

    const isAdminOrManager = backendUser?.role === 'admin' || backendUser?.role === 'manager';
    const canApply = user && !isAdminOrManager;

    const onSubmit = async (data) => {
        console.log("Submitting application data:", data);
        setIsSubmitting(true);
        try {
            const applicationData = {
                ...data,
                loanId: id,
                monthlyIncome: parseFloat(data.monthlyIncome),
                loanAmount: parseFloat(data.loanAmount),
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
            if (err.response?.status === 400 && err.response?.data?.errors) {
                const errorMsgs = err.response.data.errors.map(e => e.message).join(', ');
                toast.error(`Validation Failed: ${errorMsgs}`);
            } else {
                toast.error(err.response?.data?.message || "Failed to submit application");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleManualSubmit = async () => {
        console.log("Manual trigger started");
        const isValid = await trigger();
        if (isValid) {
            const data = getValues();
            await onSubmit(data);
        } else {
            console.warn("Manual validation failed:", errors);
            toast.error("Please correct the errors in the form.");
        }
    };

    const onFormError = (errors) => {
        console.warn("Form validation failed:", errors);
        toast.error("Please correct the errors in the form.");
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
                            src={getImageUrl(loan.images?.[0] || loan.image)} 
                            alt={loan.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="md:w-1/2 p-8">
                        <div className="badge badge-secondary mb-2">{loan.category}</div>
                        <h1 className="text-3xl font-bold mb-4">{loan.title}</h1>
                        <p className="opacity-80 mb-6">{loan.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-base-200 p-3 rounded-lg text-center">
                                <p className="text-xs uppercase opacity-60 font-bold">Interest Rate</p>
                                <p className="text-xl font-bold text-primary">{loan.interestRate}%</p>
                            </div>
                            <div className="bg-base-200 p-3 rounded-lg text-center">
                                <p className="text-xs uppercase opacity-60 font-bold">Max Limit</p>
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
                    <ul className="list-disc list-inside space-y-2 opacity-80">
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
                <div className="modal-box w-11/12 max-w-5xl bg-base-100 text-base-content rounded-2xl">
                    <h3 className="font-bold text-2xl mb-6 text-primary flex items-center gap-2">
                        <FaFileAlt /> Loan Application Form
                    </h3>
                    <form onSubmit={handleSubmit(onSubmit, onFormError)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* READ-ONLY INFO SECTION */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-base-200 p-4 rounded-xl mb-2">
                            <div className="form-control">
                                <label className="label py-1"><span className="label-text text-xs font-bold uppercase opacity-60">Applicant</span></label>
                                <p className="font-semibold px-1">{user?.displayName || 'User'}</p>
                                <p className="text-xs opacity-60 px-1">{user?.email}</p>
                            </div>
                            <div className="form-control">
                                <label className="label py-1"><span className="label-text text-xs font-bold uppercase opacity-60">Loan Program</span></label>
                                <p className="font-semibold px-1">{loan.title}</p>
                                <p className="text-xs opacity-60 px-1">{loan.category}</p>
                            </div>
                            <div className="form-control">
                                <label className="label py-1"><span className="label-text text-xs font-bold uppercase opacity-60">Interest Rate</span></label>
                                <p className="font-semibold px-1 text-primary">{loan.interestRate}% Yearly</p>
                            </div>
                        </div>

                        {/* USER INPUT FIELDS */}
                        <div className="form-control">
                            <label className="label font-semibold">First Name</label>
                            <input type="text" {...register("firstName", { required: "First name is required" })} className={`input input-bordered focus:input-primary ${errors.firstName ? 'input-error' : ''}`} placeholder="Enter your first name" />
                            {errors.firstName && <span className="text-error text-xs mt-1">{errors.firstName.message}</span>}
                        </div>
                        <div className="form-control">
                            <label className="label font-semibold">Last Name</label>
                            <input type="text" {...register("lastName", { required: "Last name is required" })} className={`input input-bordered focus:input-primary ${errors.lastName ? 'input-error' : ''}`} placeholder="Enter your last name" />
                            {errors.lastName && <span className="text-error text-xs mt-1">{errors.lastName.message}</span>}
                        </div>
                        <div className="form-control">
                            <label className="label font-semibold">Contact Number</label>
                            <input type="text" {...register("contactNumber", { required: "Contact number is required" })} className={`input input-bordered focus:input-primary ${errors.contactNumber ? 'input-error' : ''}`} placeholder="+880 1XXX XXXXXX" />
                            {errors.contactNumber && <span className="text-error text-xs mt-1">{errors.contactNumber.message}</span>}
                        </div>
                        <div className="form-control">
                            <label className="label font-semibold">National ID / Passport</label>
                            <input type="text" {...register("nationalId", { required: "National ID is required" })} className={`input input-bordered focus:input-primary ${errors.nationalId ? 'input-error' : ''}`} placeholder="Enter NID or Passport Number" />
                            {errors.nationalId && <span className="text-error text-xs mt-1">{errors.nationalId.message}</span>}
                        </div>
                        <div className="form-control">
                            <label className="label font-semibold">Income Source</label>
                            <select {...register("incomeSource", { required: "Please select income source" })} className={`select select-bordered focus:select-primary ${errors.incomeSource ? 'select-error' : ''}`}>
                                <option value="">Select source</option>
                                <option value="salary">Salary / Employment</option>
                                <option value="business">Business Income</option>
                                <option value="freelance">Freelance / Gig Work</option>
                                <option value="investment">Investment Income</option>
                                <option value="rental">Rental Income</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.incomeSource && <span className="text-error text-xs mt-1">{errors.incomeSource.message}</span>}
                        </div>
                        <div className="form-control">
                            <label className="label font-semibold">Monthly Income ($)</label>
                            <input type="number" {...register("monthlyIncome", { required: "Monthly income is required", min: { value: 0, message: "Income cannot be negative" } })} className={`input input-bordered focus:input-primary ${errors.monthlyIncome ? 'input-error' : ''}`} placeholder="e.g. 5000" />
                            {errors.monthlyIncome && <span className="text-error text-xs mt-1">{errors.monthlyIncome.message}</span>}
                        </div>
                        <div className="form-control">
                            <label className="label font-semibold">Requested Loan Amount ($)</label>
                            <input 
                                type="number" 
                                {...register("loanAmount", { 
                                    required: "Amount is required", 
                                    min: { value: 100, message: "Min amount is $100" },
                                    max: { value: loan.maxLoanLimit, message: `Max limit is $${loan.maxLoanLimit}` }
                                })} 
                                className={`input input-bordered focus:input-primary ${errors.loanAmount ? 'input-error' : ''}`} 
                                placeholder={`Max: ${loan.maxLoanLimit}`}
                            />
                            {errors.loanAmount && <span className="text-error text-xs mt-1">{errors.loanAmount.message}</span>}
                        </div>
                        <div className="form-control">
                            <label className="label font-semibold">Address</label>
                            <input type="text" {...register("address", { required: "Address is required", minLength: { value: 10, message: "Address must be at least 10 characters" } })} className={`input input-bordered focus:input-primary ${errors.address ? 'input-error' : ''}`} placeholder="Full residential address" />
                            {errors.address && <span className="text-error text-xs mt-1">{errors.address.message}</span>}
                        </div>
                        <div className="form-control md:col-span-2">
                            <label className="label font-semibold">Reason for Loan</label>
                            <textarea {...register("reasonForLoan", { required: "Please provide a reason", minLength: { value: 10, message: "Reason must be at least 10 characters" } })} className={`textarea textarea-bordered h-24 focus:textarea-primary ${errors.reasonForLoan ? 'textarea-error' : ''}`} placeholder="Explain why you need this loan (minimum 10 characters)"></textarea>
                            {errors.reasonForLoan && <span className="text-error text-xs mt-1">{errors.reasonForLoan.message}</span>}
                        </div>
                        <div className="form-control md:col-span-2">
                            <label className="label font-semibold">Extra Notes (Optional)</label>
                            <input type="text" {...register("extraNotes")} className="input input-bordered focus:input-primary" placeholder="Any additional information..." />
                        </div>

                        <div className="modal-action md:col-span-2 flex gap-4">
                            <button 
                                type="button" 
                                onClick={handleManualSubmit}
                                disabled={isSubmitting}
                                className={`btn btn-primary px-12 shadow-lg shadow-primary/30 ${isSubmitting ? 'loading' : ''}`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                            </button>
                            <button 
                                type="button" 
                                disabled={isSubmitting}
                                onClick={() => {
                                    document.getElementById('apply_modal').close();
                                }} 
                                className="btn btn-ghost px-8"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default LoanDetails;
