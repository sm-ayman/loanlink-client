import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../hooks/useAxiosPublic';
import SectionTitle from '../components/shared/SectionTitle';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { loanAPI } from '../utils/api';
import { Helmet } from 'react-helmet-async';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { FaSearch } from 'react-icons/fa';

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
        <div className="min-h-screen bg-brand-bg py-10 px-4">
            <Helmet>
                <title>All Loans | LoanLink</title>
            </Helmet>
             <div className="max-w-screen-2xl mx-auto">
                <SectionTitle heading="All Loan Programs" subHeading="Find the perfect loan for your needs" />
                
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 bg-brand-card p-4 rounded-brand border border-brand-border shadow-sm">
                    <div className="w-full md:w-1/3">
                        <Input 
                            type="text" 
                            placeholder="Search loans..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={FaSearch}
                            iconPosition="left"
                        />
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
                            <Card key={loan._id} hoverable className="p-0 overflow-hidden flex flex-col h-full">
                                <figure className="h-56 overflow-hidden relative group">
                                    <img 
                                        src={getImageUrl(loan)} 
                                        alt={loan.title} 
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                                    />
                                    <div className="absolute top-4 right-4 z-10">
                                        <Badge variant="secondary">{loan.category}</Badge>
                                    </div>
                                </figure>
                                <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-brand-text mb-2 line-clamp-1">
                                            {loan.title}
                                        </h2>
                                        <p className="text-brand-text-muted text-sm line-clamp-2 mb-4">{loan.description}</p>
                                        
                                        <div className="space-y-2 mb-2">
                                            <div className="flex justify-between items-center bg-brand-neutral/50 p-2 rounded-brand border border-brand-border/40">
                                                <span className="font-semibold text-sm">Interest Rate:</span>
                                                <Badge variant="neutral">{loan.interestRate}%</Badge>
                                            </div>
                                            <div className="flex justify-between items-center bg-brand-neutral/50 p-2 rounded-brand border border-brand-border/40">
                                                <span className="font-semibold text-sm">Max Amount:</span>
                                                <span className="text-brand-primary font-bold text-lg">${loan.maxLoanLimit?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <Link to={`/loans/${loan._id}`}>
                                            <Button variant="primary" className="w-full font-bold shadow-md shadow-brand-primary/20">
                                                View Details & Apply
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
             </div>
        </div>
    );
};

export default AllLoans;
