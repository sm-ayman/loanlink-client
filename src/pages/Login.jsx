import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";

const Login = () => {
    const { signIn, signInWithGoogle } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const from = location.state?.from?.pathname || "/dashboard";
    
    // Placeholder login logic
    const onSubmit = (data) => {
        setIsLoading(true);
        signIn(data.email, data.password)
            .then(() => {
                toast.success('Login Successful');
                navigate(from, { replace: true });
            })
            .catch(error => {
                toast.error(error.message || 'Login failed. Please check your credentials.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleGoogleLogin = () => {
        setIsGoogleLoading(true);
        signInWithGoogle()
            .then(() => {
                toast.success('Login Successful');
                navigate(from, { replace: true });
            })
            .catch(error => {
                 toast.error(error.message || 'Google login failed.');
            })
            .finally(() => {
                setIsGoogleLoading(false);
            });
    }

    return (
        <div className="hero min-h-screen bg-base-200">
            <Helmet>
                <title>Login | LoanLink</title>
            </Helmet>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6">Access your loan dashboard securely.</p>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 border border-brand-border">
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body gap-4">
                        <Input 
                            label="Email"
                            type="email" 
                            placeholder="your@email.com" 
                            icon={FaEnvelope}
                            error={errors.email?.message}
                            disabled={isLoading || isGoogleLoading}
                            {...register("email", { 
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        
                        <div className="relative">
                            <Input 
                                label="Password"
                                type="password" 
                                placeholder="••••••••" 
                                icon={FaLock}
                                error={errors.password?.message}
                                disabled={isLoading || isGoogleLoading}
                                {...register("password", { 
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                            />
                            <div className="text-right mt-1">
                                <a href="#" className="text-xs text-brand-secondary hover:underline font-medium">Forgot password?</a>
                            </div>
                        </div>

                        <div className="mt-4">
                            <Button 
                                type="submit" 
                                variant="primary" 
                                className="w-full"
                                isLoading={isLoading}
                                disabled={isGoogleLoading}
                            >
                                Login
                            </Button>
                        </div>
                        
                        <div className="divider text-brand-text-muted text-sm my-2">OR</div>
                        
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full"
                            icon={FaGoogle}
                            isLoading={isGoogleLoading}
                            disabled={isLoading}
                            onClick={handleGoogleLogin}
                        >
                            Continue with Google
                        </Button>
                        
                        <p className="mt-4 text-center text-sm">
                            New here? <Link to="/register" className="text-brand-primary font-bold hover:underline">Create an account</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
