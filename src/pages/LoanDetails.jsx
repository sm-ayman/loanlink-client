import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import SectionTitle from "../components/shared/SectionTitle";
import { FaCheckCircle, FaMoneyBillWave, FaClock, FaFileAlt, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import LoanApplicationForm from "../components/loans/LoanApplicationForm";
import { loanAPI, applicationAPI } from '../utils/api';
import Card from "../components/ui/Card";
import SkeletonCard from "../components/ui/SkeletonCard";
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
    const [relatedLoans, setRelatedLoans] = useState([]);
    const [isLoadingRelated, setIsLoadingRelated] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

    useEffect(() => {
        if (loan?.category) {
            const fetchRelated = async () => {
                setIsLoadingRelated(true);
                try {
                    const response = await loanAPI.getAllLoans({ category: loan.category });
                    if (response.success) {
                        // Filter out the current loan and take max 4
                        const filtered = response.data.loans
                            .filter(l => l._id !== loan._id)
                            .slice(0, 4);
                        setRelatedLoans(filtered);
                    }
                } catch (err) {
                    console.error("Failed to fetch related loans", err);
                } finally {
                    setIsLoadingRelated(false);
                }
            };
            fetchRelated();
        }
    }, [loan?.category, loan?._id]);

    const getImageUrl = (img) => {
        if (!img) return "https://via.placeholder.com/600x400?text=Loan+Image";
        if (img.startsWith('http')) return img;
        return `${import.meta.env.VITE_API_URL?.replace('/api', '')}/uploads/${img}`;
    };

    // Use actual images from DB
    const galleryImages = loan?.images?.length > 0 
        ? loan.images.map(img => getImageUrl(img))
        : [getImageUrl(loan?.image)];

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

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
            <div className="min-h-screen bg-brand-bg py-10 px-4">
                <div className="max-w-7xl mx-auto space-y-10">
                    <div className="bg-brand-card rounded-2xl shadow-xl overflow-hidden border border-brand-border animate-pulse">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            {/* Media Skeleton */}
                            <div className="p-6 md:p-8 bg-brand-neutral/20 border-r border-brand-border/40">
                                <div className="h-80 md:h-[400px] rounded-xl bg-base-300 mb-4"></div>
                                <div className="flex gap-4">
                                    <div className="w-24 h-16 rounded-lg bg-base-300"></div>
                                    <div className="w-24 h-16 rounded-lg bg-base-300"></div>
                                    <div className="w-24 h-16 rounded-lg bg-base-300"></div>
                                </div>
                            </div>
                            
                            {/* Content Skeleton */}
                            <div className="p-6 md:p-8 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="h-6 w-20 bg-base-300 rounded-full"></div>
                                        <div className="h-6 w-24 bg-base-300 rounded"></div>
                                    </div>
                                    <div className="h-10 w-3/4 bg-base-300 rounded mb-6"></div>
                                    
                                    <div className="mb-8 space-y-3">
                                        <div className="h-6 w-1/4 bg-base-300 rounded mb-2"></div>
                                        <div className="h-4 w-full bg-base-300 rounded"></div>
                                        <div className="h-4 w-full bg-base-300 rounded"></div>
                                        <div className="h-4 w-5/6 bg-base-300 rounded"></div>
                                    </div>
                                    
                                    <div className="h-6 w-1/3 bg-base-300 rounded mb-3"></div>
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        {[1, 2, 3, 4].map(n => (
                                            <div key={n} className="bg-brand-neutral/50 p-4 rounded-xl border border-brand-border/40">
                                                <div className="h-3 w-1/2 bg-base-300 rounded mb-2"></div>
                                                <div className="h-6 w-1/3 bg-base-300 rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-brand-border/50">
                                    <div className="h-14 w-full bg-base-300 rounded-xl"></div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Requirements Skeleton */}
                        <div className="p-8 border-t border-brand-border bg-base-100">
                            <div className="h-8 w-64 bg-base-300 rounded mb-6"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map(n => (
                                    <div key={n} className="h-12 w-full bg-base-300 rounded-lg"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
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
        <div className="min-h-screen bg-brand-bg py-10 px-4">
            {showConfetti && <Confetti width={width} height={height} numberOfPieces={300} gravity={0.15} style={{ zIndex: 9999, position: 'fixed', top: 0, left: 0 }} />}
            
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Main Content Area */}
                <div className="bg-brand-card rounded-2xl shadow-xl overflow-hidden border border-brand-border">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Media Section (Gallery) */}
                        <div className="p-6 md:p-8 bg-brand-neutral/20 border-r border-brand-border/40">
                            <div className="relative h-80 md:h-[400px] rounded-xl overflow-hidden mb-4 group shadow-md bg-base-300">
                                <img 
                                    src={galleryImages[currentImageIndex]} 
                                    alt={`${loan.title} view ${currentImageIndex + 1}`} 
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                />
                                {/* Navigation Arrows */}
                                {galleryImages.length > 1 && (
                                    <>
                                        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm btn-neutral opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FaChevronLeft />
                                        </button>
                                        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm btn-neutral opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FaChevronRight />
                                        </button>
                                    </>
                                )}
                            </div>
                            
                            {/* Thumbnails */}
                            {galleryImages.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                                    {galleryImages.map((img, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-brand-primary opacity-100 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Content Section */}
                        <div className="p-6 md:p-8 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="badge badge-secondary">{loan.category}</div>
                                    <div className="flex items-center gap-1 text-yellow-500 font-bold">
                                        <FaStar /> 4.8 <span className="text-brand-text-muted text-sm font-normal">(124 reviews)</span>
                                    </div>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-brand-text mb-6">{loan.title}</h1>
                                
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold mb-2 text-brand-text">Overview</h3>
                                    <p className="text-brand-text-muted leading-relaxed">{loan.description}</p>
                                </div>
                                
                                <h3 className="text-lg font-bold mb-3 text-brand-text">Key Specifications</h3>
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-brand-neutral/50 p-4 rounded-xl border border-brand-border/40">
                                        <div className="flex items-center gap-2 text-brand-text-muted mb-1">
                                            <FaMoneyBillWave className="text-brand-primary" />
                                            <p className="text-xs uppercase font-bold tracking-wider">Interest Rate</p>
                                        </div>
                                        <p className="text-2xl font-bold text-brand-text">{loan.interestRate}%</p>
                                    </div>
                                    <div className="bg-brand-neutral/50 p-4 rounded-xl border border-brand-border/40">
                                        <div className="flex items-center gap-2 text-brand-text-muted mb-1">
                                            <FaCheckCircle className="text-brand-secondary" />
                                            <p className="text-xs uppercase font-bold tracking-wider">Max Limit</p>
                                        </div>
                                        <p className="text-2xl font-bold text-brand-text">${loan.maxLoanLimit?.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-brand-neutral/50 p-4 rounded-xl border border-brand-border/40">
                                        <div className="flex items-center gap-2 text-brand-text-muted mb-1">
                                            <FaClock className="text-info" />
                                            <p className="text-xs uppercase font-bold tracking-wider">Term Length</p>
                                        </div>
                                        <p className="text-xl font-bold text-brand-text">1-5 Years</p>
                                    </div>
                                    <div className="bg-brand-neutral/50 p-4 rounded-xl border border-brand-border/40">
                                        <div className="flex items-center gap-2 text-brand-text-muted mb-1">
                                            <FaFileAlt className="text-accent" />
                                            <p className="text-xs uppercase font-bold tracking-wider">Processing Fee</p>
                                        </div>
                                        <p className="text-xl font-bold text-brand-text">1.5%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Area */}
                            <div className="mt-8 pt-6 border-t border-brand-border/50">
                                {canApply ? (
                                    <button 
                                        onClick={() => document.getElementById('apply_modal').showModal()}
                                        className="btn btn-primary w-full shadow-lg shadow-brand-primary/30 text-lg h-14 rounded-xl"
                                    >
                                        Apply For This Loan
                                    </button>
                                ) : (
                                    !user ? (
                                        <Link to="/login" className="btn btn-outline btn-primary w-full h-14 rounded-xl text-lg">Login to Apply</Link>
                                    ) : (
                                        <div className="alert alert-info rounded-xl">
                                            <span>Admins and Managers cannot apply for loans.</span>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Requirements Section */}
                    <div className="p-8 border-t border-brand-border bg-base-100">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-brand-text">
                            <FaFileAlt className="text-brand-primary" /> Required Documents
                        </h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(loan.requiredDocuments?.length > 0 ? loan.requiredDocuments : [
                                'Valid National ID or Passport',
                                'Proof of Income (Last 3 months)',
                                'Proof of Address (Utility bill)',
                                'Recent Bank Statements'
                            ]).map((doc, idx) => (
                                <li key={idx} className="flex items-center gap-3 bg-brand-neutral/30 p-3 rounded-lg border border-brand-border/30">
                                    <FaCheckCircle className="text-success shrink-0" />
                                    <span className="text-brand-text-muted font-medium">{doc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>


                {/* Related Items Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 text-brand-text">Related Loans</h2>
                    {isLoadingRelated ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
                        </div>
                    ) : relatedLoans.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedLoans.map(rLoan => (
                                <Card key={rLoan._id} hoverable className="p-0 overflow-hidden flex flex-col h-full bg-brand-card">
                                    <figure className="h-48 overflow-hidden relative group">
                                        <img src={getImageUrl(rLoan.images?.[0] || rLoan.image)} alt={rLoan.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute top-4 right-4 z-10">
                                            <span className="badge badge-secondary">{rLoan.category}</span>
                                        </div>
                                    </figure>
                                    <div className="p-5 flex flex-col flex-grow gap-3">
                                        <h3 className="text-lg font-bold text-brand-text line-clamp-1">{rLoan.title}</h3>
                                        <div className="flex justify-between items-center text-sm mt-auto border-t border-brand-border/30 pt-3">
                                            <span className="text-brand-text-muted">Max Limit</span>
                                            <span className="text-brand-primary font-bold">${rLoan.maxLoanLimit?.toLocaleString()}</span>
                                        </div>
                                        <Link to={`/loans/${rLoan._id}`} className="mt-2">
                                            <button className="btn btn-primary btn-sm w-full">View Details</button>
                                        </Link>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-brand-text-muted">No related loans found in this category.</p>
                    )}
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
