import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-base-200">
            <div className="footer p-10 text-base-content max-w-screen-2xl mx-auto">
                <aside>
                    <Link to="/" className="mb-4 block">
                        <img src="/logo.png" alt="LoanLink Logo" className="h-16 w-auto" />
                    </Link>
                    <p className="max-w-xs">
                        LoanLink connects borrowers with lenders offering simplified microloan request and management solutions.
                    </p>
                </aside> 
                <nav>
                    <header className="footer-title">Services</header> 
                    <a className="link link-hover">Personal Loans</a> 
                    <a className="link link-hover">Business Loans</a> 
                    <a className="link link-hover">Education Loans</a> 
                    <a className="link link-hover">Micro Financing</a>
                </nav> 
                <nav>
                    <header className="footer-title">Company</header> 
                    <Link to="/about" className="link link-hover">About us</Link> 
                    <Link to="/contact" className="link link-hover">Contact</Link> 
                    <a className="link link-hover">Jobs</a> 
                    <a className="link link-hover">Press kit</a>
                </nav> 
                <nav>
                    <header className="footer-title">Legal</header> 
                    <a className="link link-hover">Terms of use</a> 
                    <a className="link link-hover">Privacy policy</a> 
                    <a className="link link-hover">Cookie policy</a>
                </nav>
            </div>
            <div className="footer items-center p-4 bg-base-300 text-base-content border-t max-w-screen-2xl mx-auto">
                <aside className="items-center grid-flow-col">
                     <p>Copyright © {new Date().getFullYear()} - All right reserved by LoanLink Industries Ltd</p>
                </aside> 
                <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end text-xl">
                    <a href="https://facebook.com" target='_blank' rel="noreferrer"><FaFacebook /></a> 
                    <a href="https://twitter.com" target='_blank' rel="noreferrer"><FaTwitter /></a> 
                    <a href="https://linkedin.com" target='_blank' rel="noreferrer"><FaLinkedin /></a>
                    <a href="https://youtube.com" target='_blank' rel="noreferrer"><FaYoutube /></a>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
