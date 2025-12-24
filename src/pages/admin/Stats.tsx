import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Save, X } from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiGet, apiPost, apiDelete, apiPut } from "@/lib/api";
import { Stat } from "@/types/stat";

const AdminStats = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [page, setPage] = useState<Stat["page"]>("HOME");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Omit<Stat, "id"> | null>(null);

  const token = localStorage.getItem("token");

  /* ================= LOAD STATS ================= */
  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const data = await apiGet<Stat[]>("/stats");
    setStats(data);
  }

  /* ================= ADD STAT ================= */
  async function addStat() {
    if (!label || !value) return;

    await apiPost(
      "/stats",
      { label, value, page },
      token || undefined
    );

    setLabel("");
    setValue("");
    setPage("HOME");
    loadStats();
  }

  /* ================= UPDATE STAT ================= */
  async function saveEdit(id: string) {
    if (!editData) return;

    await apiPut(
      `/stats/${id}`,
      editData,
      token || undefined
    );

    setEditingId(null);
    setEditData(null);
    loadStats();
  }

  /* ================= DELETE STAT ================= */
  async function deleteStat(id: string) {
    await apiDelete(`/stats/${id}`, token || undefined);
    loadStats();
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl space-y-8">

        <h1 className="text-3xl font-serif font-bold">Stats</h1>

        {/* ADD STAT */}
        <div className="bg-card border p-6 rounded-lg space-y-4">
          <h2 className="font-semibold">Add New Stat</h2>

          <div className="grid md:grid-cols-4 gap-4">
            <Input
              placeholder="Label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />

            <Input
              placeholder="Value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />

            <select
              value={page}
              onChange={(e) => setPage(e.target.value as any)}
              className="border rounded-md px-3 py-2 bg-background"
            >
              <option value="HOME">Home</option>
              <option value="ABOUT">About</option>
              <option value="TESTIMONIALS">Testimonials</option>
            </select>

            <Button onClick={addStat}>
              <Plus size={16} /> Add
            </Button>
          </div>
        </div>

        {/* STATS LIST */}
        <div className="bg-card border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-3">Label</th>
                <th className="p-3">Value</th>
                <th className="p-3">Page</th>
                <th className="p-3 w-32"></th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat) => {
                const isEditing = editingId === stat.id;

                return (
                  <tr key={stat.id} className="border-b">
                    <td className="p-3">
                      {isEditing ? (
                        <Input
                          value={editData?.label}
                          onChange={(e) =>
                            setEditData({ ...editData!, label: e.target.value })
                          }
                        />
                      ) : (
                        stat.label
                      )}
                    </td>

                    <td className="p-3">
                      {isEditing ? (
                        <Input
                          value={editData?.value}
                          onChange={(e) =>
                            setEditData({ ...editData!, value: e.target.value })
                          }
                        />
                      ) : (
                        stat.value
                      )}
                    </td>

                    <td className="p-3">
                      {isEditing ? (
                        <select
                          value={editData?.page}
                          onChange={(e) =>
                            setEditData({ ...editData!, page: e.target.value as any })
                          }
                          className="border rounded-md px-2 py-1 bg-background"
                        >
                          <option value="HOME">Home</option>
                          <option value="ABOUT">About</option>
                          <option value="TESTIMONIALS">Testimonials</option>
                        </select>
                      ) : (
                        stat.page
                      )}
                    </td>

                    <td className="p-3 flex gap-2">
                      {isEditing ? (
                        <>
                          <Button size="icon" onClick={() => saveEdit(stat.id)}>
                            <Save size={16} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(null);
                              setEditData(null);
                            }}
                          >
                            <X size={16} />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(stat.id);
                              setEditData({
                                label: stat.label,
                                value: stat.value,
                                page: stat.page,
                              });
                            }}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteStat(stat.id)}
                          >
                            <Trash2 size={16} className="text-destructive" />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}

              {stats.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-muted-foreground">
                    No stats yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminStats;
