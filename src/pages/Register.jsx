import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authAPI } from "../utils/api";
import { Helmet } from "react-helmet-async";
import { uploadImage } from "../utils/imageUpload";

const Register = () => {
    const { signUp } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    
    const onSubmit = async (data) => {
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
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                className="input input-bordered" 
                                {...register("name", { required: true })}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input 
                                type="email" 
                                placeholder="email" 
                                className="input input-bordered" 
                                {...register("email", { required: true })}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Profile Picture</span>
                            </label>
                            <input 
                                type="file" 
                                className="file-input file-input-bordered w-full" 
                                accept="image/*"
                                {...register("image")}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Or Photo URL</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder="Photo URL" 
                                className="input input-bordered" 
                                {...register("photoURL")}
                            />
                        </div>
                         <div className="form-control">
                            <label className="label">
                                <span className="label-text">Role</span>
                            </label>
                            <select className="select select-bordered" {...register("role", { required: true })}>
                                <option value="borrower">Borrower</option>
                                <option value="manager">Manager (Loan Officer)</option>
                                {/* Admin usually not selectable, manually updated */}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input 
                                type="password" 
                                placeholder="password" 
                                className="input input-bordered" 
                                {...register("password", { 
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                                    validate: {
                                        hasUpper: value => /[A-Z]/.test(value) || "Must contain at least one uppercase letter",
                                        hasLower: value => /[a-z]/.test(value) || "Must contain at least one lowercase letter"
                                    } 
                                })}
                            />
                            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary">Register</button>
                        </div>
                        <p className="mt-4 text-center">Already have an account? <Link to="/login" className="text-primary font-bold">Login</Link></p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
