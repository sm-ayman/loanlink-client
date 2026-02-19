import { FaEdit, FaTrash, FaUserShield } from "react-icons/fa";

const ManageAdmins = () => {
    // Static data for demonstration
    const admins = [
        { id: 1, name: "John Doe", email: "john@admin.com", role: "Super Admin", status: "Active", lastLogin: "2 mins ago" },
        { id: 2, name: "Jane Smith", email: "jane@admin.com", role: "Admin", status: "Active", lastLogin: "1 hour ago" },
        { id: 3, name: "Mike Johnson", email: "mike@admin.com", role: "Viewer", status: "Inactive", lastLogin: "5 days ago" },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <FaUserShield className="text-secondary" /> Manage Admins
                </h1>
                <button className="btn btn-primary">Add New Admin</button>
            </div>

            <div className="card bg-base-100 shadow-xl border border-gray-100">
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            {/* head */}
                            <thead className="bg-base-200 text-base-content/70">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Last Login</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map((admin, index) => (
                                    <tr key={admin.id} className="hover">
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar placeholder">
                                                    <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                        <span className="text-xs">{admin.name.charAt(0)}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{admin.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{admin.email}</td>
                                        <td>
                                            <span className={`badge ${admin.role === 'Super Admin' ? 'badge-secondary' : 'badge-ghost'} badge-sm`}>
                                                {admin.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${admin.status === 'Active' ? 'badge-success' : 'badge-error'} badge-outline badge-sm`}>
                                                {admin.status}
                                            </span>
                                        </td>
                                        <td className="text-sm text-gray-500">{admin.lastLogin}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button className="btn btn-square btn-ghost btn-sm text-info">
                                                    <FaEdit />
                                                </button>
                                                <button className="btn btn-square btn-ghost btn-sm text-error">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageAdmins;
