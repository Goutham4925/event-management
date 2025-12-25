import { useEffect, useState } from "react";
import { Shield, UserCheck, UserX } from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiPut,apiGetAuth } from "@/lib/api";

/* =========================
   TYPES
========================= */
type User = {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  status: "PENDING" | "APPROVED" | "BLOCKED";
  createdAt: string;
};

const ManageUsers = () => {
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD USERS ================= */
  const loadUsers = async () => {
    try {
      const data = await apiGetAuth<User[]>("/users", token!);
      setUsers(data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* ================= ACTIONS ================= */
  const approveUser = async (id: string) => {
    await apiPut(`/admin/users/${id}/approve`, {}, token || undefined);
    toast({ title: "User approved" });
    loadUsers();
  };

  const blockUser = async (id: string) => {
    await apiPut(`/admin/users/${id}/block`, {}, token || undefined);
    toast({ title: "User blocked" });
    loadUsers();
  };

  const promoteUser = async (id: string) => {
    await apiPut(`/admin/users/${id}/promote`, {}, token || undefined);
    toast({ title: "User promoted to admin" });
    loadUsers();
  };

  /* ================= UI ================= */
  return (
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="font-serif text-3xl font-bold">User Management</h1>

        {loading ? (
          <p className="text-muted-foreground">Loading users…</p>
        ) : (
          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="border-b bg-secondary/50">
                <tr>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b hover:bg-secondary/30"
                  >
                    <td className="p-4">{u.email}</td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          u.role === "ADMIN"
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          u.status === "APPROVED"
                            ? "bg-green-500/20 text-green-600"
                            : u.status === "BLOCKED"
                            ? "bg-red-500/20 text-red-600"
                            : "bg-yellow-500/20 text-yellow-600"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      {u.status === "PENDING" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => approveUser(u.id)}
                        >
                          <UserCheck size={16} className="mr-1" />
                          Approve
                        </Button>
                      )}

                      {u.status !== "BLOCKED" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => blockUser(u.id)}
                        >
                          <UserX size={16} className="mr-1" />
                          Block
                        </Button>
                      )}

                      {u.role !== "ADMIN" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => promoteUser(u.id)}
                        >
                          <Shield size={16} className="mr-1" />
                          Promote
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <p className="p-6 text-center text-muted-foreground">
                No users found
              </p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
