import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import useRole from "../../hooks/useRole";

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [role] = useRole();

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-6">User Profile</h2>
            
            <div className="card bg-base-100 shadow-xl max-w-2xl">
                <div className="card-body">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <div className="avatar">
                            <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} alt="Profile" />
                            </div>
                        </div>
                        <div className="w-full">
                            <h3 className="text-2xl font-bold">{user?.displayName}</h3>
                            <p className="text-gray-500">{user?.email}</p>
                            <div className="badge badge-primary mt-2 uppercase">{role}</div>
                            
                            <div className="divider"></div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label text-sm text-gray-500 pb-0">Phone</label>
                                    <p className="font-semibold">{user?.phoneNumber || 'Not Provided'}</p>
                                </div>
                                <div>
                                    <label className="label text-sm text-gray-500 pb-0">UserID</label>
                                    <p className="font-semibold text-xs overflow-hidden text-ellipsis">{user?.uid}</p>
                                </div>
                                <div>
                                    <label className="label text-sm text-gray-500 pb-0">Last Login</label>
                                    <p className="font-semibold">{user?.metadata?.lastSignInTime}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
