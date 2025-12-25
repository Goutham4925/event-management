import { useEffect, useState } from "react";
import {
  Shield,
  UserCheck,
  UserX,
  Trash2,
  Undo2,
} from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiPut, apiGetAuth, apiDelete } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

/* =========================
   TYPES
========================= */
type User = {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  status: "PENDING" | "APPROVED" | "BLOCKED";
};

const ManageUsers = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const token = localStorage.getItem("token")!;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD USERS ================= */
  const loadUsers = async () => {
    try {
      const data = await apiGetAuth<User[]>("/users", token);
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
  const approve = async (id: string) => {
    await apiPut(`/users/${id}/approve`, {}, token);
    toast({ title: "User approved" });
    loadUsers();
  };

  const block = async (id: string) => {
    await apiPut(`/users/${id}/block`, {}, token);
    toast({ title: "User blocked" });
    loadUsers();
  };

  const unblock = async (id: string) => {
    await apiPut(`/users/${id}/unblock`, {}, token);
    toast({ title: "User unblocked" });
    loadUsers();
  };

  const promote = async (id: string) => {
    await apiPut(`/users/${id}/promote`, {}, token);
    toast({ title: "Promoted to admin" });
    loadUsers();
  };

  const demote = async (id: string) => {
    await apiPut(`/users/${id}/demote`, {}, token);
    toast({ title: "Demoted to user" });
    loadUsers();
  };

  const remove = async (id: string) => {
    if (currentUser?.id === id) {
      toast({
        title: "Action blocked",
        description: "You cannot delete your own account",
        variant: "destructive",
      });
      return;
    }

    if (!confirm("Delete this user permanently?")) return;

    await apiDelete(`/users/${id}`, token);
    toast({ title: "User deleted" });
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
                {users.map((u) => {
                  const isSelf = currentUser?.id === u.id;

                  return (
                    <tr key={u.id} className="border-b hover:bg-secondary/30">
                      <td className="p-4">{u.email}</td>

                      <td className="p-4">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-muted">
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
                        {/* APPROVE */}
                        {u.status === "PENDING" && (
                          <Button size="sm" variant="ghost" onClick={() => approve(u.id)}>
                            <UserCheck size={16} /> Approve
                          </Button>
                        )}

                        {/* BLOCK / UNBLOCK */}
                        {!isSelf && (
                          u.status === "BLOCKED" ? (
                            <Button size="sm" variant="ghost" onClick={() => unblock(u.id)}>
                              <Undo2 size={16} /> Unblock
                            </Button>
                          ) : (
                            <Button size="sm" variant="ghost" onClick={() => block(u.id)}>
                              <UserX size={16} /> Block
                            </Button>
                          )
                        )}

                        {/* PROMOTE / DEMOTE */}
                        {!isSelf && u.status === "APPROVED" && (
                          u.role === "USER" ? (
                            <Button size="sm" variant="ghost" onClick={() => promote(u.id)}>
                              <Shield size={16} /> Promote
                            </Button>
                          ) : (
                            <Button size="sm" variant="ghost" onClick={() => demote(u.id)}>
                              <Shield size={16} /> Demote
                            </Button>
                          )
                        )}

                        {/* DELETE */}
                        {!isSelf && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => remove(u.id)}
                          >
                            <Trash2 size={16} /> Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
