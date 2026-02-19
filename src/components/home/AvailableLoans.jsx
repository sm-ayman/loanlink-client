import { useEffect, useState } from 'react';
import SectionTitle from '../shared/SectionTitle';
import { Link } from 'react-router-dom';

const AvailableLoans = () => {
    // TODO: Replace with data fetching from API
    // const [loans, setLoans] = useState([]);
    // useEffect(() => { ...fetch('/loans?limit=6')... }, [])

    const loans = [
        { _id: '1', title: 'Personal Loan', category: 'Personal', image: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=2070&auto=format&fit=crop', maxAmount: 5000, interest: '5%' },
        { _id: '2', title: 'Business Startup', category: 'Business', image: 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2070&auto=format&fit=crop', maxAmount: 50000, interest: '8%' },
        { _id: '3', title: 'Home Renovation', category: 'Home', image: 'https://images.unsplash.com/photo-1628151016003-346761664f33?q=80&w=2070&auto=format&fit=crop', maxAmount: 20000, interest: '6.5%' },
        { _id: '4', title: 'Education Fund', category: 'Education', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop', maxAmount: 15000, interest: '4%' },
        { _id: '5', title: 'Car Loan', category: 'Vehicle', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop', maxAmount: 30000, interest: '7%' },
        { _id: '6', title: 'Tech Equipment', category: 'Business', image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=1854&auto=format&fit=crop', maxAmount: 5000, interest: '9%' },
    ];

    return (
        <section className="my-16 max-w-screen-2xl mx-auto px-4">
            <SectionTitle heading="Available Loans" subHeading="Latest Opportunities" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loans.map(loan => (
                    <div key={loan._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <figure className="h-48 overflow-hidden">
                            <img src={loan.image} alt={loan.title} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title justify-between">
                                {loan.title}
                                <div className="badge badge-secondary">{loan.category}</div>
                            </h2>
                            <p>Max Amount: <span className='font-bold text-primary'>${loan.maxAmount}</span></p>
                            <p>Interest Rate: {loan.interest}</p>
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
