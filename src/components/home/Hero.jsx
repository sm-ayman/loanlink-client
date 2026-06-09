import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const Hero = () => {
    return (
        <div className="hero min-h-[600px] bg-base-200 relative overflow-hidden">
            {/* Background elements for visual appeal */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl mix-blend-multiply filter animate-blob"></div>
                <div className="absolute top-10 right-10 w-64 h-64 bg-secondary rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-10 left-1/2 w-64 h-64 bg-accent rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-4000"></div>
            </div>

            <div className="hero-content flex-col lg:flex-row-reverse z-10">
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1"
                >
                    <img 
                        src="https://img.freepik.com/free-vector/saving-money-concept-illustration_114360-1215.jpg?w=740&t=st=1686812845~exp=1686813445~hmac=a4c9276c00d4133497d5174542562483864278850625906801874246888497" 
                        className="max-w-sm lg:max-w-lg rounded-lg shadow-2xl mx-auto" 
                        alt="Loan Illustration"
                    />
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 text-center lg:text-left"
                >
                    <h1 className="text-5xl font-bold leading-tight">
                        Empowering Your <span className="text-brand-primary">Financial Dreams</span>
                    </h1>
                    <p className="py-6 text-lg opacity-70">
                        Get quick, transparent, and hassle-free loans. Whether it's for education, business, or personal needs, LoanLink bridges the gap between you and your goals.
                    </p>
                    <Link to="/all-loans">
                        <Button variant="primary" size="lg" className="shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            Apply for Loan
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
