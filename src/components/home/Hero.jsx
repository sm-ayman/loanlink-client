import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

// A simple count-up component for dynamic statistics
const CountUp = ({ end, suffix = "", text }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const increment = end / (duration / 16); // 60fps

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                clearInterval(timer);
                setCount(end);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [end]);

    return (
        <div className="flex flex-col items-center p-4 bg-base-100/50 backdrop-blur-sm rounded-xl border border-base-300 shadow-sm">
            <span className="text-3xl font-bold text-brand-primary">{count}{suffix}</span>
            <span className="text-sm opacity-70 mt-1">{text}</span>
        </div>
    );
};

const Hero = () => {
    return (
        <div className="hero px-6 md:px-12 lg:px-20 min-h-[100vh] lg:min-h-[600px] lg:h-[70vh] lg:max-h-[800px] py-24 lg:py-0 bg-base-200 relative overflow-hidden flex items-center">
            {/* Background elements for visual appeal */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl mix-blend-multiply filter animate-blob"></div>
                <div className="absolute top-10 right-10 w-64 h-64 bg-secondary rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-10 left-1/2 w-64 h-64 bg-accent rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-4000"></div>
            </div>

            <div className="hero-content max-w-screen-2xl mx-auto w-full flex-col lg:flex-row-reverse z-10 justify-between gap-10 lg:gap-20">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 w-full max-w-lg lg:max-w-xl relative"
                >
                    <img 
                        src="/hero-img.jpg" 
                        className="w-full rounded-2xl shadow-2xl hover:scale-[1.02] transition-transform duration-500" 
                        alt="Loan Illustration"
                    />
                    {/* Floating element animation */}
                    <motion.div 
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="absolute -bottom-6 -left-6 bg-base-100 p-4 rounded-xl shadow-xl border border-base-200 hidden md:block"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center text-success">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs opacity-70 font-medium">Loan Approved</p>
                                <p className="text-sm font-bold text-base-content">In 24 Hours</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 text-center lg:text-left space-y-6"
                >
                    <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight text-base-content">
                        Empowering Your <br className="hidden lg:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Financial Dreams</span>
                    </h1>
                    <p className="text-base lg:text-lg opacity-80 max-w-xl mx-auto lg:mx-0">
                        Get quick, transparent, and hassle-free loans. Whether it's for education, business, or personal needs, LoanLink bridges the gap between you and your goals.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
                        <Link to="/all-loans">
                            <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-brand-primary/30 hover:shadow-brand-primary/50 hover:-translate-y-1 transition-all duration-300 rounded-full px-8">
                                Apply Now
                            </Button>
                        </Link>
                        <Link to="/contact">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 hover:-translate-y-1 transition-all duration-300">
                                Contact Us
                            </Button>
                        </Link>
                    </div>

                    {/* Dynamic Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8 border-t border-base-300 mt-8">
                        <CountUp end={50} suffix="k+" text="Active Users" />
                        <CountUp end={100} suffix="M+" text="Loans Disbursed" />
                        <CountUp end={99} suffix="%" text="Success Rate" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
