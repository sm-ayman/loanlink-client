import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-base-200">
            <div className="footer p-10 text-base-content max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                <aside className="flex flex-col items-center md:items-start text-center md:text-left">
                    <Link to="/" className="mb-4 block">
                        <img src="/logo.png" alt="LoanLink Logo" className="h-24 w-auto logo-blend" />
                    </Link>
                    <p className="max-w-xs opacity-80">
                        LoanLink connects borrowers with lenders offering simplified microloan request and management solutions.
                    </p>
                </aside> 
                <nav className="flex flex-col items-center md:items-start">
                    <header className="footer-title opacity-100 font-bold">Services</header> 
                    <a className="link link-hover">Personal Loans</a> 
                    <a className="link link-hover">Business Loans</a> 
                    <a className="link link-hover">Education Loans</a> 
                    <a className="link link-hover">Micro Financing</a>
                </nav> 
                <nav className="flex flex-col items-center md:items-start">
                    <header className="footer-title opacity-100 font-bold">Company</header> 
                    <Link to="/about" className="link link-hover">About us</Link> 
                    <Link to="/contact" className="link link-hover">Contact</Link> 
                    <a className="link link-hover">Jobs</a> 
                    <a className="link link-hover">Press kit</a>
                </nav> 
                <nav className="flex flex-col items-center md:items-start">
                    <header className="footer-title opacity-100 font-bold">Legal</header> 
                    <a className="link link-hover">Terms of use</a> 
                    <a className="link link-hover">Privacy policy</a> 
                    <a className="link link-hover">Cookie policy</a>
                </nav>
            </div>
            <div className="footer items-center p-6 bg-base-300 text-base-content border-t max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between gap-4">
                <aside className="text-center md:text-left">
                     <p className="text-sm opacity-70">Copyright © {new Date().getFullYear()} - All rights reserved by <span className="font-bold text-primary">LoanLink</span> Industries Ltd</p>
                </aside> 
                <nav className="flex gap-6 text-2xl">
                    <a href="https://facebook.com" className="hover:text-primary transition-colors" target='_blank' rel="noreferrer"><FaFacebook /></a> 
                    <a href="https://twitter.com" className="hover:text-primary transition-colors" target='_blank' rel="noreferrer"><FaTwitter /></a> 
                    <a href="https://linkedin.com" className="hover:text-primary transition-colors" target='_blank' rel="noreferrer"><FaLinkedin /></a>
                    <a href="https://youtube.com" className="hover:text-primary transition-colors" target='_blank' rel="noreferrer"><FaYoutube /></a>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
