import { Helmet } from "react-helmet-async";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import toast from "react-hot-toast";

const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Message sent! We will get back to you soon.");
        e.target.reset();
    };

    return (
        <div className="min-h-screen pt-24 pb-16 bg-base-100">
            <Helmet>
                <title>Contact Us | LoanLink</title>
            </Helmet>

            <div className="max-w-screen-xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4">Get in <span className="text-primary">Touch</span></h1>
                    <p className="text-xl opacity-70">Have questions? We're here to help you every step of the way.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="card bg-primary text-primary-content p-10 shadow-2xl">
                            <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                                        <FaPhone />
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-70 uppercase font-bold">Call Us</p>
                                        <p className="text-xl font-medium">+1 (555) 000-1234</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                                        <FaEnvelope />
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-70 uppercase font-bold">Email Us</p>
                                        <p className="text-xl font-medium">support@loanlink.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-70 uppercase font-bold">Visit Us</p>
                                        <p className="text-xl font-medium">123 Finance Plaza, Suite 400<br />New York, NY 10001</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">FB</div>
                                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">TW</div>
                                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">LN</div>
                                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">IG</div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="h-64 rounded-3xl overflow-hidden bg-base-200 border-4 border-base-200 shadow-xl">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1645000000000!5m2!1sen!2sbd" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen="" 
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="card bg-base-100 p-10 shadow-2xl border border-base-200">
                        <h2 className="text-3xl font-bold mb-8">Send a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-control">
                                    <label className="label font-bold uppercase text-xs opacity-50">Your Name</label>
                                    <input type="text" placeholder="John Doe" className="input input-bordered focus:input-primary bg-base-200 border-none" required />
                                </div>
                                <div className="form-control">
                                    <label className="label font-bold uppercase text-xs opacity-50">Your Email</label>
                                    <input type="email" placeholder="john@example.com" className="input input-bordered focus:input-primary bg-base-200 border-none" required />
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="label font-bold uppercase text-xs opacity-50">Subject</label>
                                <input type="text" placeholder="How can we help?" className="input input-bordered focus:input-primary bg-base-200 border-none" required />
                            </div>
                            <div className="form-control">
                                <label className="label font-bold uppercase text-xs opacity-50">Message</label>
                                <textarea className="textarea textarea-bordered h-40 focus:textarea-primary bg-base-200 border-none" placeholder="Type your message here..." required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary w-full btn-lg gap-3 shadow-lg shadow-primary/30">
                                <FaPaperPlane /> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
