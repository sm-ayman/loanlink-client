import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authAPI } from "../utils/api";
import { Helmet } from "react-helmet-async";
import { uploadImage } from "../utils/imageUpload";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { FaUser, FaEnvelope, FaImage, FaLink, FaLock } from "react-icons/fa";

const Register = () => {
    const { signUp } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            let photoURL = data.photoURL;
            
            // Upload image to ImgBB if a file is selected
            if (data.image && data.image[0]) {
                toast.loading('Uploading image...', { id: 'upload' });
                photoURL = await uploadImage(data.image[0]);
                toast.success('Image uploaded', { id: 'upload' });
            }

            await signUp(data.name, data.email, data.password, data.role, photoURL);
            toast.success('Registration Successful');
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.message || 'Registration failed', { id: 'upload' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <Helmet>
                <title>Register | LoanLink</title>
            </Helmet>
             <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Register now!</h1>
                    <p className="py-6">Join LoanLink to apply for or manage loans.</p>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 border border-brand-border">
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body gap-4">
                        <Input 
                            label="Full Name"
                            type="text" 
                            placeholder="John Doe" 
                            icon={FaUser}
                            error={errors.name?.message}
                            disabled={isLoading}
                            {...register("name", { required: "Name is required" })}
                        />
                        
                        <Input 
                            label="Email"
                            type="email" 
                            placeholder="your@email.com" 
                            icon={FaEnvelope}
                            error={errors.email?.message}
                            disabled={isLoading}
                            {...register("email", { 
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        
                        <div className="flex flex-col w-full gap-1.5">
                            <label className="text-xs font-semibold tracking-wider text-brand-text/80 uppercase">
                                Profile Picture (Upload)
                            </label>
                            <input 
                                type="file" 
                                className="file-input file-input-bordered w-full h-12 text-sm bg-brand-neutral/30 text-brand-text border-brand-border rounded-brand focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/40" 
                                accept="image/*"
                                disabled={isLoading}
                                {...register("image")}
                            />
                        </div>
                        
                        <Input 
                            label="Or Photo URL"
                            type="text" 
                            placeholder="https://example.com/photo.jpg" 
                            icon={FaLink}
                            disabled={isLoading}
                            {...register("photoURL")}
                        />
                        
                        <div className="flex flex-col w-full gap-1.5">
                            <label className="text-xs font-semibold tracking-wider text-brand-text/80 uppercase">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <select 
                                className="select select-bordered w-full h-12 bg-brand-neutral/30 text-brand-text border-brand-border rounded-brand focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/40" 
                                disabled={isLoading}
                                {...register("role", { required: "Role is required" })}
                            >
                                <option value="borrower">Borrower</option>
                                <option value="manager">Manager (Loan Officer)</option>
                            </select>
                            {errors.role && <span className="text-xs text-red-500 font-medium">{errors.role.message}</span>}
                        </div>
                        
                        <Input 
                            label="Password"
                            type="password" 
                            placeholder="••••••••" 
                            icon={FaLock}
                            error={errors.password?.message}
                            disabled={isLoading}
                            {...register("password", { 
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be at least 6 characters" },
                                validate: {
                                    hasUpper: value => /[A-Z]/.test(value) || "Must contain at least one uppercase letter",
                                    hasLower: value => /[a-z]/.test(value) || "Must contain at least one lowercase letter"
                                } 
                            })}
                        />
                        
                        <div className="mt-4">
                            <Button 
                                type="submit" 
                                variant="primary" 
                                className="w-full"
                                isLoading={isLoading}
                            >
                                Register
                            </Button>
                        </div>
                        
                        <p className="mt-4 text-center text-sm">
                            Already have an account? <Link to="/login" className="text-brand-primary font-bold hover:underline">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
