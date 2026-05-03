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
        <section className="my-16 max-w-screen-2xl mx-auto px-4 overflow-hidden">
            <SectionTitle heading="Testimonials" subHeading="What Our Customers Say" />
            
            <div className="carousel w-full rounded-box gap-4 py-10">
                {reviews.map((review, index) => (
                    <div key={review.id} id={`slide${index}`} className="carousel-item relative w-full md:w-1/3 block">
                        <div className="card bg-base-100 shadow-xl border border-base-200 p-8 h-full mx-2 flex flex-col justify-between">
                            <div>
                                <FaQuoteLeft className="text-4xl text-primary opacity-20 mb-4" />
                                <p className="opacity-70 mb-6 italic">"{review.review}"</p>
                            </div>
                            <div className="flex items-center gap-4 mt-auto">
                                <div className="avatar">
                                    <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                        <img src={review.image} alt={review.name} />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{review.name}</h4>
                                    <p className="text-sm opacity-60 font-medium">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Carousel Navigation Hints */}
            <div className="flex justify-center w-full py-2 gap-2">
                {reviews.map((_, index) => (
                    <a key={index} href={`#slide${index}`} className="btn btn-xs btn-circle"></a>
                ))}
            </div>
        </section>
    );
};

export default CustomerFeedback;
