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
import SkeletonCard from '../components/ui/SkeletonCard';
import { FaSearch, FaStar, FaClock } from 'react-icons/fa';

const AllLoans = () => {
    const axiosPublic = useAxiosPublic();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    // STATIC DATA MODE
    const [loans, setLoans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryFilter]);

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                setIsLoading(true);
                const params = { page: currentPage, limit: 8 };
                if (searchTerm) params.search = searchTerm;
                if (categoryFilter) params.category = categoryFilter;

                const response = await loanAPI.getAllLoans(params);
                if (response.success) {
                    setLoans(response.data.loans);
                    setPagination(response.data.pagination);
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
    }, [searchTerm, categoryFilter, currentPage]);

    const categories = ['Personal', 'Business', 'Home', 'Vehicle', 'Education'];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-bg py-10 px-4">
                <div className="max-w-screen-2xl mx-auto">
                    <SectionTitle heading="All Loan Programs" subHeading="Find the perfect loan for your needs" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <SkeletonCard key={n} />)}
                    </div>
                </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loans.map(loan => (
                            <Card key={loan._id} hoverable className="p-0 overflow-hidden flex flex-col h-full">
                                <figure className="h-48 overflow-hidden relative group">
                                    <img 
                                        src={getImageUrl(loan)} 
                                        alt={loan.title} 
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                                    />
                                    <div className="absolute top-4 right-4 z-10">
                                        <Badge variant="secondary">{loan.category}</Badge>
                                    </div>
                                </figure>
                                <div className="p-5 flex flex-col flex-grow gap-3">
                                    <h3 className="text-xl font-bold text-brand-text line-clamp-1">
                                        {loan.title}
                                    </h3>
                                    
                                    <p className="text-brand-text-muted text-sm line-clamp-2">
                                        {loan.description || "Discover competitive rates and flexible terms tailored just for you. Apply today to secure your financial future."}
                                    </p>
                                    
                                    <div className="space-y-2 mt-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="flex items-center gap-1.5 text-brand-text-muted"><FaClock className="text-brand-primary/70" /> Term</span>
                                            <span className="font-medium text-brand-text">1-5 Years</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="flex items-center gap-1.5 text-brand-text-muted"><FaStar className="text-yellow-500" /> Rating</span>
                                            <span className="font-medium text-brand-text">5.0 (Excellent)</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-brand-text-muted">Interest Rate</span>
                                            <Badge variant="neutral" className="px-2 py-0.5 text-xs">{loan.interestRate}%</Badge>
                                        </div>
                                        <div className="flex justify-between items-center text-sm pt-2 border-t border-brand-border/30">
                                            <span className="font-semibold">Max Amount</span>
                                            <span className="text-brand-primary font-bold text-lg">${loan.maxLoanLimit?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-auto pt-4">
                                        <Link to={`/loans/${loan._id}`}>
                                            <Button variant="primary" className="w-full font-semibold shadow-md shadow-brand-primary/20">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                        <div className="join border border-brand-border/50 shadow-sm rounded-xl">
                            <button 
                                className="join-item btn bg-brand-card hover:bg-brand-neutral/50 border-0"
                                disabled={!pagination.hasPrev}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            >
                                «
                            </button>
                            
                            {[...Array(pagination.totalPages)].map((_, idx) => (
                                <button 
                                    key={idx}
                                    className={`join-item btn border-0 ${currentPage === idx + 1 ? 'bg-brand-primary text-white hover:bg-brand-primary/90' : 'bg-brand-card hover:bg-brand-neutral/50'}`}
                                    onClick={() => setCurrentPage(idx + 1)}
                                >
                                    {idx + 1}
                                </button>
                            ))}

                            <button 
                                className="join-item btn bg-brand-card hover:bg-brand-neutral/50 border-0"
                                disabled={!pagination.hasNext}
                                onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                            >
                                »
                            </button>
                        </div>
                    </div>
                )}
             </div>
        </div>
    );
};

export default AllLoans;
