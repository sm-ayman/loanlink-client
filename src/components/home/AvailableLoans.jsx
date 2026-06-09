import { useEffect, useState } from 'react';
import SectionTitle from '../shared/SectionTitle';
import { Link } from 'react-router-dom';
import { loanAPI } from '../../utils/api';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

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

    const getImageUrl = (loan) => {
        const img = loan.images?.[0] || loan.image;
        if (!img) return "https://via.placeholder.com/400x250?text=Loan+Image";
        if (img.startsWith('http')) return img;
        return `${import.meta.env.VITE_API_URL?.replace('/api', '')}/uploads/${img}`;
    };

    return (
        <section className="my-16 max-w-screen-2xl mx-auto px-4">
            <SectionTitle heading="Available Loans" subHeading="Latest Opportunities" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loans.map(loan => (
                    <Card key={loan._id} hoverable className="p-0 overflow-hidden">
                        <figure className="h-48 overflow-hidden relative">
                            <img src={getImageUrl(loan)} alt={loan.title} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                        </figure>
                        <div className="p-6 flex flex-col gap-4">
                            <div className="flex justify-between items-start gap-4">
                                <h3 className="text-lg font-bold text-brand-text uppercase leading-snug">
                                    {loan.title}
                                </h3>
                                <Badge variant="secondary">{loan.category}</Badge>
                            </div>
                            <div className="space-y-1 text-sm text-brand-text-muted">
                                <p>Max Amount: <span className='font-bold text-brand-primary text-base'>${loan.maxLoanLimit?.toLocaleString()}</span></p>
                                <p>Interest Rate: <span className="font-semibold text-brand-text">{loan.interestRate}%</span></p>
                            </div>
                            <div className="mt-2">
                                <Link to={`/loans/${loan._id}`}>
                                    <Button variant="outline" className="w-full">View Details</Button>
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
