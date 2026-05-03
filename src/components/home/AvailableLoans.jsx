import { useEffect, useState } from 'react';
import SectionTitle from '../shared/SectionTitle';
import { Link } from 'react-router-dom';
import { loanAPI } from '../../utils/api';

const AvailableLoans = () => {
    const [loans, setLoans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHomeLoans = async () => {
            try {
                const response = await loanAPI.getHomeLoans();
                if (response.success) {
                    setLoans(response.data.loans);
                }
            } catch (error) {
                console.error("Failed to fetch home loans:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHomeLoans();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center my-16">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <section className="my-16 max-w-screen-2xl mx-auto px-4">
            <SectionTitle heading="Available Loans" subHeading="Latest Opportunities" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loans.map(loan => (
                    <div key={loan._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <figure className="h-48 overflow-hidden relative">
                            <img src={loan.images?.[0] || "https://via.placeholder.com/400x250?text=Loan+Image"} alt={loan.title} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title justify-between">
                                {loan.title}
                                <div className="badge badge-secondary">{loan.category}</div>
                            </h2>
                            <p>Max Amount: <span className='font-bold text-primary'>${loan.maxLoanLimit?.toLocaleString()}</span></p>
                            <p>Interest Rate: {loan.interestRate}%</p>
                            <div className="card-actions justify-end mt-4">
                                <Link to={`/loans/${loan._id}`} className="btn btn-outline btn-primary w-full">View Details</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
             <div className="text-center mt-10">
                <Link to="/all-loans" className="btn btn-wide btn-primary">See All Loans</Link>
            </div>
        </section>
    );
};

export default AvailableLoans;
