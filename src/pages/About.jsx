import { Helmet } from "react-helmet-async";
import { FaUsers, FaHandshake, FaGlobe, FaBullseye } from "react-icons/fa";

const About = () => {
    return (
        <div className="min-h-screen pt-24 pb-16 bg-base-100">
            <Helmet>
                <title>About Us | LoanLink</title>
            </Helmet>

            {/* Hero Section */}
            <div className="bg-primary/5 py-20 mb-16">
                <div className="max-w-screen-xl mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">Empowering Your <span className="text-primary">Financial Future</span></h1>
                    <p className="text-xl opacity-70 max-w-2xl mx-auto">
                        LoanLink is a community-driven microloan platform dedicated to providing accessible financial solutions for individuals and small businesses.
                    </p>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-4">
                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <FaBullseye className="text-primary" /> Our Mission
                        </h2>
                        <p className="text-lg opacity-80 leading-relaxed mb-6">
                            Our mission is to bridge the gap between financial institutions and everyday people. We believe that everyone deserves a chance to grow, whether it's starting a small business, pursuing education, or handling an emergency.
                        </p>
                        <p className="text-lg opacity-80 leading-relaxed">
                            Through transparency, low interest rates, and a streamlined application process, we're making microloans simpler and faster than ever before.
                        </p>
                    </div>
                    <div className="rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                        <img 
                            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                            alt="Team working" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Core Values */}
                <div className="mb-20">
                    <h2 className="text-4xl font-bold text-center mb-12">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card bg-base-200 p-8 hover:shadow-xl transition-all">
                            <FaUsers className="text-5xl text-primary mb-6" />
                            <h3 className="text-2xl font-bold mb-4">Community First</h3>
                            <p className="opacity-70">We prioritize the needs of our community, ensuring that our services are tailored to help real people solve real problems.</p>
                        </div>
                        <div className="card bg-base-200 p-8 hover:shadow-xl transition-all">
                            <FaHandshake className="text-5xl text-secondary mb-6" />
                            <h3 className="text-2xl font-bold mb-4">Transparency</h3>
                            <p className="opacity-70">No hidden fees, no complex jargon. We believe in clear communication and honest financial practices.</p>
                        </div>
                        <div className="card bg-base-200 p-8 hover:shadow-xl transition-all">
                            <FaGlobe className="text-5xl text-accent mb-6" />
                            <h3 className="text-2xl font-bold mb-4">Global Impact</h3>
                            <p className="opacity-70">Our platform is designed to scale, bringing financial inclusion to underserved regions across the globe.</p>
                        </div>
                    </div>
                </div>

                {/* Team Section Placeholder */}
                <div className="text-center py-20 bg-base-200 rounded-3xl">
                    <h2 className="text-3xl font-bold mb-4">Join Thousands of Satisfied Users</h2>
                    <p className="text-xl opacity-60 mb-8">Start your journey with LoanLink today and experience the difference.</p>
                    <button className="btn btn-primary btn-lg px-12">Get Started Now</button>
                </div>
            </div>
        </div>
    );
};

export default About;
