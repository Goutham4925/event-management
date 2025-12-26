import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiGetAuth, apiPost, apiPut, apiDelete } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type Category = {
  id: string;
  name: string;
  order?: number;
};

const ManageCategories = () => {
  const { toast } = useToast();
  const token = localStorage.getItem("token")!;
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await apiGetAuth<Category[]>("/categories", token);
    setCategories(data);
  }

  async function addCategory() {
    if (!newName.trim()) return;

    await apiPost("/categories", { name: newName }, token);
    setNewName("");
    load();
    toast({ title: "Category added" });
  }

  async function updateCategory(id: string, name: string) {
    await apiPut(`/categories/${id}`, { name }, token);
    toast({ title: "Category updated" });
  }

  async function removeCategory(id: string) {
    if (!confirm("Delete this category?")) return;
    await apiDelete(`/categories/${id}`, token);
    load();
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl space-y-6">
        <h1 className="font-serif text-3xl font-bold">Categories</h1>

        {/* Add */}
        <div className="flex gap-2">
          <Input
            placeholder="New category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button onClick={addCategory}>
            <Plus size={16} />
          </Button>
        </div>

        {/* List */}
        <div className="space-y-3">
          {categories.map((c) => (
            <div
              key={c.id}
              className="flex gap-2 items-center bg-card border rounded-lg p-3"
            >
              <Input
                value={c.name}
                onChange={(e) =>
                  setCategories((prev) =>
                    prev.map((x) =>
                      x.id === c.id ? { ...x, name: e.target.value } : x
                    )
                  )
                }
              />

              <Button
                size="icon"
                variant="ghost"
                onClick={() => updateCategory(c.id, c.name)}
              >
                <Save size={16} />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeCategory(c.id)}
              >
                <Trash2 size={16} className="text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageCategories;
