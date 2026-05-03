import Hero from "../components/home/Hero";
import AvailableLoans from "../components/home/AvailableLoans";
import HowItWorks from "../components/home/HowItWorks";
import CustomerFeedback from "../components/home/CustomerFeedback";
import { Helmet } from "react-helmet-async";

const Home = () => {
    return (
        <div className="min-h-screen">
            <Helmet>
                <title>LoanLink | Fast & Secure Microloans</title>
            </Helmet>
            <Hero />
            <AvailableLoans />
            <HowItWorks />
            <CustomerFeedback />
            
            {/* Extra Section 1: About/Mission */}
            <section className="py-20 bg-primary text-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-6">Why Choose LoanLink?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        We are committed to providing financial access to everyone. Our platform ensures security, transparency, and speed in every transaction. Join thousands of satisfied users today.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10">
                        <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                            <h3 className="text-3xl font-bold">10k+</h3>
                            <p>Active Users</p>
                        </div>
                        <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                            <h3 className="text-3xl font-bold">$5M+</h3>
                            <p>Loans Disbursed</p>
                        </div>
                        <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                            <h3 className="text-3xl font-bold">98%</h3>
                            <p>Approval Rate</p>
                        </div>
                        <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                            <h3 className="text-3xl font-bold">24/7</h3>
                            <p>Support</p>
                        </div>
                    </div>
                </div>
            </section>

             {/* Extra Section 2: Newsletter/CTA */}
             <section className="py-16 bg-base-100">
                <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 bg-base-200 rounded-2xl p-10 shadow-inner">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold mb-4">Stay Updated with Financial Tips</h2>
                        <p className="opacity-70">Subscribe to our newsletter to get the latest updates on loan interest rates, financial advice, and special offers.</p>
                    </div>
                    <div className="flex-1 w-full max-w-md">
                        <div className="join w-full">
                            <input className="input input-bordered join-item w-full" placeholder="Enter your email" />
                            <button className="btn btn-secondary join-item">Subscribe</button>
                        </div>
                    </div>
                </div>
             </section>
        </div>
    );
};

export default Home;
