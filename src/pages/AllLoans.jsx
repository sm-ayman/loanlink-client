import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../hooks/useAxiosPublic';
import SectionTitle from '../components/shared/SectionTitle';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { loanAPI } from '../utils/api';
import { Helmet } from 'react-helmet-async';

const AllLoans = () => {
    const axiosPublic = useAxiosPublic();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    // STATIC DATA MODE
    const [loans, setLoans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                setIsLoading(true);
                const params = {};
                if (searchTerm) params.search = searchTerm;
                if (categoryFilter) params.category = categoryFilter;

                const response = await loanAPI.getAllLoans(params);
                if (response.success) {
                    setLoans(response.data.loans);
                } else {
                    throw new Error(response.message);
                }
                setIsError(false);
            } catch (err) {
                console.error("Failed to load loans", err);
                setError(err);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchLoans, 300); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [searchTerm, categoryFilter]);

    const categories = ['Personal', 'Business', 'Home', 'Vehicle', 'Education'];

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex justify-center items-center text-error">
                <p>Error loading loans: {error.message}</p>
            </div>
        );
    }

    const getImageUrl = (loan) => {
        const img = loan.images?.[0] || loan.image;
        if (!img) return "https://via.placeholder.com/400x250?text=Loan+Image";
        if (img.startsWith('http')) return img;
        return `${import.meta.env.VITE_API_URL?.replace('/api', '')}/uploads/${img}`;
    };

    return (
        <div className="min-h-screen bg-base-200 py-10 px-4">
            <Helmet>
                <title>All Loans | LoanLink</title>
            </Helmet>
             <div className="max-w-screen-2xl mx-auto">
                <SectionTitle heading="All Loan Programs" subHeading="Find the perfect loan for your needs" />
                
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 bg-base-100 p-4 rounded-xl shadow-sm">
                    <div className="w-full md:w-1/3">
                        <label className="input input-bordered flex items-center gap-2">
                            <input 
                                type="text" 
                                className="grow" 
                                placeholder="Search loans..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                        </label>
                    </div>
                    
                    <div className="w-full md:w-1/4">
                        <select 
                            className="select select-bordered w-full"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Loans Grid */}
                {loans.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-bold opacity-50">No loans found matching your criteria.</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loans.map(loan => (
                            <div key={loan._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-200">
                                <figure className="h-56 overflow-hidden relative group">
                                    <img 
                                        src={getImageUrl(loan)} 
                                        alt={loan.title} 
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                                    />
                                    <div className="absolute top-4 right-4 badge badge-secondary badge-lg shadow-md uppercase">
                                        {loan.category}
                                    </div>
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title text-2xl font-bold mb-2">
                                        {loan.title}
                                    </h2>
                                    <p className="opacity-70 line-clamp-2 mb-4">{loan.description}</p>
                                    
                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-between items-center bg-base-200 p-2 rounded-lg">
                                            <span className="font-semibold text-sm">Interest Rate:</span>
                                            <span className="badge badge-outline font-bold">{loan.interestRate}%</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-base-200 p-2 rounded-lg">
                                            <span className="font-semibold text-sm">Max Amount:</span>
                                            <span className="text-primary font-bold text-lg">${loan.maxLoanLimit?.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="card-actions justify-end mt-auto">
                                        <Link to={`/loans/${loan._id}`} className="btn btn-primary w-full text-white font-bold shadow-lg hover:shadow-primary/50 transition-all">
                                            View Details & Apply
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
             </div>
        </div>
    );
};

export default AllLoans;
