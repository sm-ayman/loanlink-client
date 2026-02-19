import SectionTitle from "../shared/SectionTitle";
import { FaUserPlus, FaFileAlt, FaHandHoldingUsd, FaCheckCircle } from "react-icons/fa";

const HowItWorks = () => {
    const steps = [
        {
            id: 1,
            icon: <FaUserPlus className="text-4xl text-white" />,
            title: "Register Account",
            description: "Sign up for a free account as a borrower or lender in just a few minutes.",
            color: "bg-primary"
        },
        {
            id: 2,
            icon: <FaFileAlt className="text-4xl text-white" />,
            title: "Apply for Loan",
            description: "Browse available loans and submit your application with required details.",
            color: "bg-secondary"
        },
        {
            id: 3,
            icon: <FaCheckCircle className="text-4xl text-white" />,
            title: "Get Approval",
            description: "Wait for the admin or manager to review and approve your loan request.",
            color: "bg-accent"
        },
        {
            id: 4,
            icon: <FaHandHoldingUsd className="text-4xl text-white" />,
            title: "Receive Funds",
            description: "Once approved, funds are disbursed directly to your account.",
            color: "bg-success"
        }
    ];

    return (
        <section className="my-16 bg-base-200 py-16">
            <div className="max-w-screen-2xl mx-auto px-4">
                <SectionTitle heading="How It Works" subHeading="Simple Process" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step) => (
                        <div key={step.id} className="relative p-6 bg-base-100 rounded-xl shadow-lg text-center hover:-translate-y-2 transition-transform duration-300">
                            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg ${step.color}`}>
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                            
                            {/* Connector Line (hidden on mobile/last item) */}
                            {step.id !== 4 && (
                                <div className="hidden lg:block absolute top-16 -right-4 w-8 border-t-2 border-dashed border-gray-300 z-0"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
