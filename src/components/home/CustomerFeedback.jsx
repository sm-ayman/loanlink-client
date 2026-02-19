import SectionTitle from "../shared/SectionTitle";
import { FaQuoteLeft } from "react-icons/fa";

const CustomerFeedback = () => {
    const reviews = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Small Business Owner",
            review: "LoanLink helped me secure funding for my bakery expansion when traditional banks turned me down. The process was incredibly fast and transparent.",
            image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Student",
            review: "I needed a quick loan for my semester fees. The application was straightforward, and I got approved within 24 hours. Highly recommended!",
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            id: 3,
            name: "Emily Davis",
            role: "Freelancer",
            review: "As a freelancer, income stability is tough. LoanLink's microloans helped me upgrade my equipment. The repayment terms are very flexible.",
            image: "https://randomuser.me/api/portraits/women/68.jpg"
        }
    ];

    return (
        <section className="my-16 max-w-screen-2xl mx-auto px-4">
            <SectionTitle heading="Testimonials" subHeading="What Our Customers Say" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.map((review) => (
                    <div key={review.id} className="card bg-base-100 shadow-xl border border-gray-100 p-8">
                        <FaQuoteLeft className="text-4xl text-primary opacity-20 mb-4" />
                        <p className="text-gray-600 mb-6 italic">"{review.review}"</p>
                        <div className="flex items-center gap-4">
                            <div className="avatar">
                                <div className="w-12 h-12 rounded-full">
                                    <img src={review.image} alt={review.name} />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">{review.name}</h4>
                                <p className="text-sm text-gray-500">{review.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CustomerFeedback;
