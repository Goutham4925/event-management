import { useEffect, useState } from "react";
import { Trash2, Eye, Reply } from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { apiGetAuth, apiPut, apiDelete } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  eventType?: string;
  message: string;
  status: "NEW" | "READ" | "REPLIED";
  createdAt: string;
};

const ManageMessages = () => {
  const { toast } = useToast();
  const token = localStorage.getItem("token")!;
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    const data = await apiGetAuth<ContactMessage[]>("/contact", token);
    setMessages(data);
  }

  async function updateStatus(
    id: string,
    status: ContactMessage["status"]
  ) {
    await apiPut(`/contact/${id}/status`, { status }, token);
    loadMessages();
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    await apiDelete(`/contact/${id}`, token);
    loadMessages();
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl space-y-6">
        <h1 className="font-serif text-3xl font-bold">
          Contact Messages
        </h1>

        {messages.length === 0 && (
          <p className="text-muted-foreground">No enquiries yet</p>
        )}

        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className="bg-card border rounded-lg p-5 space-y-4"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-semibold">
                    {m.name}{" "}
                    <span className="text-sm text-muted-foreground">
                      ({m.email})
                    </span>
                  </h3>

                  {/* EVENT TYPE */}
                  {m.eventType && (
                    <span className="inline-block text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                      Event: {m.eventType}
                    </span>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* STATUS */}
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    m.status === "NEW"
                      ? "bg-yellow-100 text-yellow-700"
                      : m.status === "READ"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {m.status}
                </span>
              </div>

              {/* MESSAGE */}
              <p className="text-sm text-foreground whitespace-pre-line">
                {m.message}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => updateStatus(m.id, "READ")}
                >
                  <Eye size={14} className="mr-1" />
                  Mark Read
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => updateStatus(m.id, "REPLIED")}
                >
                  <Reply size={14} className="mr-1" />
                  Mark Replied
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => remove(m.id)}
                >
                  <Trash2 size={14} className="text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageMessages;
