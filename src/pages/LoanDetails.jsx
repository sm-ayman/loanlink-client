import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import SectionTitle from "../components/shared/SectionTitle";
import { FaCheckCircle, FaMoneyBillWave, FaClock, FaFileAlt } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import LoanApplicationForm from "../components/loans/LoanApplicationForm";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoanDetails = () => {
    const { id } = useParams();
    const { user, getEffectiveUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [loan, setLoan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showApplicationForm, setShowApplicationForm] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        import('../public/loans.json')
            .then(data => {
                const foundLoan = data.default.find(l => l._id === id);
                setLoan(foundLoan);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading loan details:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    
    if (!loan) return (
        <div className="min-h-screen flex flex-col justify-center items-center gap-4">
            <h2 className="text-3xl font-bold text-error">Loan Not Found</h2>
            <Link to="/all-loans" className="btn btn-primary">Back to All Loans</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-base-200 py-10 px-4">
             <div className="max-w-4xl mx-auto bg-base-100 rounded-2xl shadow-xl overflow-hidden">
                <figure className="h-64 md:h-80 w-full relative">
                    <img src={loan.image} alt={loan.title} className="w-full h-full object-cover" />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <div className="p-8 text-white">
                             <div className="badge badge-secondary mb-2">{loan.category}</div>
                             <h1 className="text-4xl font-bold">{loan.title}</h1>
                        </div>
                    </div>
                </figure>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div className="stats shadow bg-primary text-primary-content">
                            <div className="stat">
                                <div className="stat-figure text-primary-content">
                                    <FaMoneyBillWave className="text-3xl" />
                                </div>
                                <div className="stat-title text-primary-content/80">Max Amount</div>
                                <div className="stat-value text-2xl">${loan.maxAmount.toLocaleString()}</div>
                            </div>
                        </div>
                        
                        <div className="stats shadow bg-secondary text-secondary-content">
                            <div className="stat">
                                <div className="stat-figure text-secondary-content">
                                    <FaClock className="text-3xl" />
                                </div>
                                <div className="stat-title text-secondary-content/80">Interest Rate</div>
                                <div className="stat-value text-2xl">{loan.interestRate}%</div>
                            </div>
                        </div>

                        <div className="stats shadow bg-accent text-accent-content">
                            <div className="stat">
                                <div className="stat-figure text-accent-content">
                                    <FaFileAlt className="text-3xl" />
                                </div>
                                <div className="stat-title text-accent-content/80">Processing</div>
                                <div className="stat-value text-2xl">Usually 24h</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold mb-3">About this Loan</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {loan.description}
                            </p>
                        </div>

                        <div className="divider"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <FaCheckCircle className="text-success" /> Requirements
                                </h3>
                                <ul className="space-y-2">
                                    {loan.requirements?.map((req, index) => (
                                        <li key={index} className="flex items-center gap-2 text-gray-700">
                                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-bold mb-4">Repayment Options</h3>
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra border">
                                        <thead>
                                            <tr>
                                                <th>Duration</th>
                                                <th>Interest</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loan.emiPlans?.map((plan, idx) => (
                                                <tr key={idx}>
                                                    <td>{plan.duration}</td>
                                                    <td>{plan.rate}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end gap-4">
                        <Link to="/all-loans" className="btn btn-ghost">Back to List</Link>
                        {user ? (
                            getEffectiveUser()?.role !== 'admin' && getEffectiveUser()?.role !== 'manager' ? (
                                <button
                                    onClick={() => setShowApplicationForm(true)}
                                    className="btn btn-primary btn-lg shadow-lg"
                                >
                                    Apply Now
                                </button>
                            ) : (
                                <div className="text-sm text-gray-500 self-center">
                                    {getEffectiveUser()?.role === 'admin' ? 'Admin cannot apply for loans' : 'Managers cannot apply for loans'}
                                </div>
                            )
                        ) : (
                            <button
                                onClick={() => {
                                    toast.error("Please login to apply for loans");
                                    navigate("/login");
                                }}
                                className="btn btn-primary btn-lg shadow-lg"
                            >
                                Login to Apply
                            </button>
                        )}
                    </div>
                </div>
             </div>

            {/* Loan Application Form Modal */}
            <LoanApplicationForm
                loan={loan}
                isOpen={showApplicationForm}
                onClose={() => setShowApplicationForm(false)}
                onSuccess={(application) => {
                    // Redirect to my loans page or show success message
                    toast.success("Application submitted successfully! Check your dashboard.");
                    navigate("/dashboard/my-loans");
                }}
            />
        </div>
    );
};

export default LoanDetails;
