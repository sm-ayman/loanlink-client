import { useState, useEffect } from "react";
import { FaTrash, FaUserCheck, FaUserShield, FaBan, FaSearch, FaUser } from "react-icons/fa";
import { userAPI } from "../../../utils/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const ManageUsers = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState(0);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: limit,
                role: selectedRole,
                search: searchTerm
            };
            const response = await userAPI.getAllUsers(params);
            if (response.success) {
                setUsers(response.data.users);
                setTotalUsers(response.data.pagination.totalUsers);
            }
        } catch (error) {
            console.error('Error loading users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(loadUsers, 500); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [currentPage, searchTerm, selectedRole]);

    const handleRoleChange = async (user, newRole) => {
        const roleNames = {
            'borrower': 'Borrower',
            'manager': 'Manager',
            'admin': 'Admin'
        };

        const result = await Swal.fire({
            title: `Change Role to ${roleNames[newRole]}?`,
            text: `Are you sure you want to change the role of ${user.email} to ${roleNames[newRole]}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#10B981",
            cancelButtonColor: "#6B7280",
            confirmButtonText: "Yes, Update",
            cancelButtonText: "Cancel"
        });

        if (result.isConfirmed) {
            try {
                const response = await userAPI.updateUserRole(user._id, { role: newRole });
                if (response.success) {
                    toast.success("User role updated successfully!");
                    loadUsers();
                }
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to update role");
            }
        }
    };

    const handleSuspendUser = async (user) => {
        const suspendForm = `
            <div class="text-left space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Reason for Suspension *</label>
                    <select id="suspend-reason" class="swal2-select w-full p-2 border rounded">
                        <option value="">Select a reason</option>
                        <option value="Policy Violation">Policy Violation</option>
                        <option value="Suspicious Activity">Suspicious Activity</option>
                        <option value="Account Misuse">Account Misuse</option>
                        <option value="Fraudulent Behavior">Fraudulent Behavior</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Additional Feedback</label>
                    <textarea id="suspend-feedback" class="swal2-textarea w-full p-2 border rounded" placeholder="Provide additional details..." rows="3"></textarea>
                </div>
            </div>
        `;

        const result = await Swal.fire({
            title: `${user.isSuspended ? 'Unsuspend' : 'Suspend'} User?`,
            html: user.isSuspended ? `
                <div class="text-left">
                    <p><strong>User:</strong> ${user.name} (${user.email})</p>
                    <p>This will restore user access to the system.</p>
                </div>
            ` : suspendForm,
            icon: user.isSuspended ? "question" : "warning",
            showCancelButton: true,
            confirmButtonColor: user.isSuspended ? "#10B981" : "#EF4444",
            cancelButtonColor: "#6B7280",
            confirmButtonText: user.isSuspended ? "Yes, Unsuspend" : "Suspend User",
            cancelButtonText: "Cancel",
            preConfirm: () => {
                if (user.isSuspended) return true;

                const reason = document.getElementById('suspend-reason').value;
                const feedback = document.getElementById('suspend-feedback').value;

                if (!reason) {
                    Swal.showValidationMessage('Please select a suspension reason');
                    return false;
                }

                return { reason, feedback };
            }
        });

        if (result.isConfirmed) {
            try {
                const suspendData = {
                    isSuspended: !user.isSuspended,
                    suspendReason: result.value?.reason || '',
                    suspendFeedback: result.value?.feedback || ''
                };

                const response = await userAPI.suspendUser(user._id, suspendData);
                if (response.success) {
                    toast.success(`User ${suspendData.isSuspended ? 'suspended' : 'unsuspended'} successfully!`);
                    loadUsers();
                }
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to update suspension status");
            }
        }
    };

    const totalPages = Math.ceil(totalUsers / limit);
    const pagination = {
        currentPage,
        totalPages,
        totalUsers,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
    };

    // Reset to page 1 when search/filter changes
    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleRoleFilterChange = (value) => {
        setSelectedRole(value);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="p-6 bg-base-100 min-h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold flex items-center gap-2">
                    <FaUserShield className="text-primary" /> Manage Users
                </h2>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <FaUser className="inline-block w-6 h-6 stroke-current" />
                        </div>
                        <div className="stat-title">Total Users</div>
                        <div className="stat-value text-primary">{pagination.totalUsers || 0}</div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-base-100 p-4 rounded-lg shadow mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="input input-bordered flex items-center gap-2">
                            <FaSearch className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="grow"
                            />
                        </label>
                    </div>
                    <div className="w-full md:w-48">
                        <select
                            value={selectedRole}
                            onChange={(e) => handleRoleFilterChange(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="">All Roles</option>
                            <option value="borrower">Borrowers</option>
                            <option value="manager">Managers</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>
                </div>
            </div>
            
            {users.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">👥</div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">No Users Found</h2>
                    <p className="text-gray-500">
                        {searchTerm || selectedRole ? 'Try adjusting your search or filter criteria' : 'No users registered yet'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto bg-white shadow-xl rounded-xl border border-gray-100">
                        <table className="table w-full">
                            <thead className="bg-base-200">
                                <tr>
                                    <th>#</th>
                                    <th>User Info</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user._id} className="hover:bg-base-50 transition-colors">
                                        <th>{(currentPage - 1) * limit + index + 1}</th>
                                        <td>
                                            <div className="flex items-center space-x-3">
                                                <div className="avatar placeholder">
                                                    <div className={`bg-neutral-focus text-neutral-content rounded-full w-10 ring ring-offset-base-100 ring-offset-2 ${
                                                        user.role === 'admin' ? 'ring-primary' :
                                                        user.role === 'manager' ? 'ring-secondary' : 'ring-accent'
                                                    }`}>
                                                        <span className="text-xs">{user.name.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{user.name}</div>
                                                    <div className="text-sm opacity-50">{user.email}</div>
                                                    <div className="text-xs text-gray-400">
                                                        Joined {new Date(user.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user, e.target.value)}
                                                className={`select select-sm ${
                                                    user.role === 'admin' ? 'select-primary' :
                                                    user.role === 'manager' ? 'select-secondary' : 'select-accent'
                                                }`}
                                            >
                                                <option value="borrower">Borrower</option>
                                                <option value="manager">Manager</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div className="flex flex-col gap-1">
                                                <span className={`badge ${
                                                    !user.isSuspended ? 'badge-success' : 'badge-error'
                                                } badge-sm badge-outline gap-1`}>
                                                    {!user.isSuspended ? 'Active' : 'Suspended'}
                                                </span>
                                                {user.isSuspended && user.suspendReason && (
                                                    <span className="text-xs text-gray-500 max-w-32 truncate" title={user.suspendReason}>
                                                        {user.suspendReason}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleSuspendUser(user)}
                                                    className={`btn btn-sm btn-circle btn-ghost tooltip ${
                                                        user.isSuspended ? 'text-success' : 'text-error'
                                                    }`}
                                                    data-tip={user.isSuspended ? 'Unsuspend User' : 'Suspend User'}
                                                >
                                                    <FaBan />
                                                </button>
                                                <button className="btn btn-sm btn-circle btn-ghost text-gray-500 tooltip" data-tip="Delete User (Not implemented)">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            <div className="join">
                                <button
                                    className="join-item btn btn-sm"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    «
                                </button>
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        className={`join-item btn btn-sm ${page === currentPage ? 'btn-active' : ''}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    className="join-item btn btn-sm"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                                    disabled={currentPage === pagination.totalPages}
                                >
                                    »
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ManageUsers;
