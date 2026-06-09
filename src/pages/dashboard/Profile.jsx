import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import useRole from "../../hooks/useRole";
import { applicationAPI } from "../../utils/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FaChartBar, FaUserCircle, FaEnvelope, FaIdBadge, FaClock, FaUser, FaLink } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const Profile = () => {
    const { user, updateUserProfile } = useContext(AuthContext);
    const [role] = useRole();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Edit Profile State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        const fetchStats = async () => {
            if (role === 'manager' || role === 'admin' || role === 'super-admin') {
                try {
                    setLoading(true);
                    const res = await applicationAPI.getApplicationStats();
                    if (res.success) {
                        const data = [
                            { name: 'Pending', count: res.data.pending, color: '#F59E0B' },
                            { name: 'Approved', count: res.data.approved, color: '#10B981' },
                            { name: 'Rejected', count: res.data.rejected, color: '#EF4444' }
                        ];
                        setStats(data);
                    }
                } catch (err) {
                    console.error("Error fetching profile stats:", err);
                } finally {
                    setLoading(false);
                }
            }
        };
        if (role) fetchStats();
    }, [role]);

    const openEditModal = () => {
        reset({
            name: user?.displayName || '',
            photoURL: user?.photoURL || ''
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateProfile = async (data) => {
        setIsUpdating(true);
        try {
            await updateUserProfile(data.name, data.photoURL);
            toast.success("Profile updated successfully");
            setIsEditModalOpen(false);
            // Optionally reload to see changes immediately depending on how AuthContext is listening
            window.location.reload();
        } catch (error) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="p-6 bg-base-200 min-h-screen">
            <Helmet>
                <title>My Profile | LoanLink</title>
            </Helmet>
            
            <div className="max-w-6xl mx-auto space-y-8">
                <header>
                    <h1 className="text-4xl font-bold text-base-content">Account Overview</h1>
                    <p className="text-gray-500 mt-2">Manage your profile and view system statistics</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="card bg-base-100 shadow-2xl lg:col-span-1 border border-base-200">
                        <div className="card-body items-center text-center">
                            <div className="avatar mb-4">
                                <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 shadow-xl">
                                    <img src={user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} alt="Profile" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold">{user?.displayName || 'User'}</h2>
                            <div className="badge badge-primary badge-lg mt-2 uppercase font-bold tracking-wider">{role}</div>
                            
                            <div className="divider w-full"></div>
                            
                            <div className="w-full space-y-4 text-left">
                                <div className="flex items-center gap-3">
                                    <FaEnvelope className="text-primary opacity-50" />
                                    <div className="truncate">
                                        <p className="text-xs font-bold text-gray-400 uppercase">Email Address</p>
                                        <p className="font-medium truncate">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaIdBadge className="text-primary opacity-50" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">User ID</p>
                                        <p className="font-mono text-[10px] opacity-70">{user?.uid}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaClock className="text-primary opacity-50" />
                                    <div>
                                        <p className="text-xs font-bold text-base-content/60 uppercase">Last Login</p>
                                        <p className="text-sm opacity-70">{new Date(user?.metadata?.lastSignInTime).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="card-actions mt-8 w-full">
                                <Button onClick={openEditModal} variant="outline" className="w-full">
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats/Charts Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {(role === 'manager' || role === 'admin' || role === 'super-admin') && (
                            <div className="card bg-base-100 shadow-2xl border border-base-200">
                                <div className="card-body">
                                    <h3 className="card-title text-xl mb-6 flex items-center gap-2">
                                        <FaChartBar className="text-primary" /> Application Metrics Overview
                                    </h3>
                                    
                                    {loading ? (
                                        <div className="h-64 flex items-center justify-center">
                                            <span className="loading loading-spinner loading-lg text-primary"></span>
                                        </div>
                                    ) : (
                                        <div className="h-80 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={stats}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip 
                                                        cursor={{fill: 'transparent'}}
                                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                    />
                                                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                                        {stats.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}
                                    
                                    <div className="grid grid-cols-3 gap-4 mt-6">
                                        {stats.map((stat, i) => (
                                            <div key={i} className="bg-base-200 p-4 rounded-2xl text-center shadow-sm">
                                                <p className="text-xs font-bold text-base-content/50 uppercase mb-1">{stat.name}</p>
                                                <p className="text-2xl font-bold" style={{color: stat.color}}>{stat.count}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {role === 'borrower' && (
                            <div className="card bg-primary text-primary-content shadow-2xl overflow-hidden relative">
                                <div className="card-body relative z-10">
                                    <h3 className="text-2xl font-bold mb-4">Welcome back, {user?.displayName?.split(' ')[0]}!</h3>
                                    <p className="opacity-90 max-w-md">Ready to manage your financial goals? Check your active loan applications or explore new opportunities in the market.</p>
                                    <div className="card-actions mt-6">
                                        <button className="btn btn-white text-primary font-bold">View My Loans</button>
                                        <button className="btn btn-ghost border-white/30 text-white">Apply New</button>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal 
                isOpen={isEditModalOpen} 
                onClose={() => !isUpdating && setIsEditModalOpen(false)}
                title="Update Profile"
            >
                <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-4 pt-2">
                    <Input 
                        label="Full Name"
                        type="text" 
                        placeholder="John Doe" 
                        icon={FaUser}
                        error={errors.name?.message}
                        disabled={isUpdating}
                        {...register("name", { required: "Name is required" })}
                    />
                    
                    <Input 
                        label="Profile Photo URL"
                        type="text" 
                        placeholder="https://example.com/photo.jpg" 
                        icon={FaLink}
                        disabled={isUpdating}
                        {...register("photoURL")}
                    />
                    
                    <div className="flex justify-end gap-3 pt-4 border-t border-brand-border mt-6">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsEditModalOpen(false)}
                            disabled={isUpdating}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            isLoading={isUpdating}
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Profile;
