import { useForm } from "react-hook-form";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const AddLoan = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    // const axiosSecure = useAxiosSecure();

    const onSubmit = (data) => {
        // TODO: Upload image to imgbb/cloudinary and get URL
        // const imageFile = { image: data.image[0] }
        // const res = await axiosPublic.post(image_hosting_api, imageFile, ...)
        
        const loanData = {
            title: data.title,
            category: data.category,
            interestRate: data.interestRate,
            maxAmount: parseFloat(data.maxAmount),
            description: data.description,
            // image: res.data.data.display_url
            image: "https://via.placeholder.com/300", // Placeholder
            showOnHome: data.showOnHome === 'true'
        }

        console.log(loanData);
        // axiosSecure.post('/loans', loanData) ...
        toast.success("Loan Added Successfully (Mock)");
        reset();
    };

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-6">Add New Loan</h2>
            
            <div className="card bg-base-100 shadow-xl max-w-4xl mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Loan Title</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder="e.g. Personal Loan" 
                                className="input input-bordered w-full" 
                                {...register("title", { required: "Title is required" })}
                            />
                            {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Category</span>
                            </label>
                            <select className="select select-bordered w-full" {...register("category", { required: true })}>
                                <option value="Personal">Personal</option>
                                <option value="Business">Business</option>
                                <option value="Education">Education</option>
                                <option value="Home">Home</option>
                                <option value="Vehicle">Vehicle</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Interest Rate (%)</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder="e.g. 5%" 
                                className="input input-bordered w-full" 
                                {...register("interestRate", { required: "Interest rate is required" })}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Max Loan Amount</span>
                            </label>
                            <input 
                                type="number" 
                                placeholder="e.g. 50000" 
                                className="input input-bordered w-full" 
                                {...register("maxAmount", { required: "Max amount is required" })}
                            />
                        </div>
                    </div>

                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea 
                            className="textarea textarea-bordered h-24" 
                            placeholder="Loan details..."
                            {...register("description", { required: "Description is required" })}
                        ></textarea>
                    </div>
                    
                    <div className="form-control mt-4 w-fit">
                        <label className="cursor-pointer label justify-start gap-4">
                            <span className="label-text">Show on Home Page?</span> 
                            <input type="checkbox" className="toggle toggle-primary" {...register("showOnHome")} value="true" />
                        </label>
                    </div>

                    <div className="form-control mt-6">
                        <button className="btn btn-primary">Add Loan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLoan;
