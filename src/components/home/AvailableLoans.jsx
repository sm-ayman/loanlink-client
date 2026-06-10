import { useEffect, useState } from 'react';
import SectionTitle from '../shared/SectionTitle';
import { Link } from 'react-router-dom';
import { loanAPI } from '../../utils/api';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import SkeletonCard from '../ui/SkeletonCard';
import { FaStar, FaClock } from 'react-icons/fa';

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
            <section className="my-16 max-w-screen-2xl mx-auto px-4">
                <SectionTitle heading="Available Loans" subHeading="Latest Opportunities" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
                </div>
            </section>
        );
    }

    const getImageUrl = (loan) => {
        const img = loan.images?.[0] || loan.image;
        if (!img) return "https://via.placeholder.com/400x250?text=Loan+Image";
        if (img.startsWith('http')) return img;
        return `${import.meta.env.VITE_API_URL?.replace('/api', '')}/uploads/${img}`;
    };

    return (
        <section className="my-16 max-w-screen-2xl mx-auto px-4">
            <SectionTitle heading="Available Loans" subHeading="Latest Opportunities" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loans.slice(0, 8).map(loan => (
                    <Card key={loan._id} hoverable className="p-0 overflow-hidden flex flex-col h-full">
                        <figure className="h-48 overflow-hidden relative group">
                            <img src={getImageUrl(loan)} alt={loan.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
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
            
             <div className="text-center mt-10">
                <Link to="/all-loans">
                    <Button variant="primary" className="px-10">See All Loans</Button>
                </Link>
            </div>
        </section>
    );
};

export default AvailableLoans;
