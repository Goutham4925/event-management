import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Save, X, Filter, Search } from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiGet, apiPost, apiDelete, apiPut } from "@/lib/api";
import { Stat } from "@/types/stat";

const AdminStats = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [filteredStats, setFilteredStats] = useState<Stat[]>([]);
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [page, setPage] = useState<Stat["page"]>("HOME");
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPage, setSelectedPage] = useState<string>("ALL");
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Omit<Stat, "id"> | null>(null);

  const token = localStorage.getItem("token");

  const pages = ["HOME", "ABOUT", "TESTIMONIALS"];

  /* ================= LOAD STATS ================= */
  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [stats, searchTerm, selectedPage]);

  async function loadStats() {
    const data = await apiGet<Stat[]>("/stats");
    setStats(data);
    setFilteredStats(data);
  }

  /* ================= FILTER STATS ================= */
  function applyFilters() {
    let filtered = [...stats];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (stat) =>
          stat.label.toLowerCase().includes(term) ||
          stat.value.toLowerCase().includes(term)
      );
    }

    if (selectedPage !== "ALL") {
      filtered = filtered.filter((stat) => stat.page === selectedPage);
    }

    setFilteredStats(filtered);
  }

  /* ================= ADD STAT ================= */
  async function addStat() {
    if (!label.trim() || !value.trim()) return;

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
    if (!confirm("Are you sure you want to delete this stat?")) return;
    
    await apiDelete(`/stats/${id}`, token || undefined);
    loadStats();
  }

  const getPageBadgeColor = (page: string) => {
    switch (page) {
      case "HOME": return "bg-gradient-gold text-charcoal font-semibold";
      case "ABOUT": return "bg-secondary text-foreground border border-border";
      case "TESTIMONIALS": return "bg-muted text-foreground border border-border";
      default: return "bg-muted text-foreground";
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8 p-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gradient-gold">
              Statistics Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage statistics displayed across different pages
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Total Stats: <span className="text-primary font-semibold">{stats.length}</span>
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - ADD STAT FORM */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 border-border bg-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Plus className="h-5 w-5 text-primary" />
                  Add New Statistic
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block text-foreground">
                      Label
                    </label>
                    <Input
                      placeholder="e.g., Happy Clients"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      className="w-full bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block text-foreground">
                      Value
                    </label>
                    <Input
                      placeholder="e.g., 500+"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="w-full bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block text-foreground">
                      Page
                    </label>
                    <select
                      value={page}
                      onChange={(e) => setPage(e.target.value as any)}
                      className="w-full border border-border rounded-md px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="HOME">Home Page</option>
                      <option value="ABOUT">About Page</option>
                      <option value="TESTIMONIALS">Testimonials Page</option>
                    </select>
                  </div>

                  <Button 
                    onClick={addStat} 
                    className="w-full mt-2 bg-gradient-gold hover:bg-gradient-gold/90 text-charcoal font-semibold shadow-gold"
                    disabled={!label.trim() || !value.trim()}
                  >
                    <Plus size={16} className="mr-2" /> 
                    Add Statistic
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN - STATS LIST */}
          <div className="lg:col-span-2">
            <Card className="border-border bg-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-foreground">
                  <span>Statistics List</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {filteredStats.length} of {stats.length} stats
                  </span>
                </CardTitle>
                
                {/* FILTERS */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search stats..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                      value={selectedPage}
                      onChange={(e) => setSelectedPage(e.target.value)}
                      className="border border-border rounded-md px-3 py-2 bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="ALL">All Pages</option>
                      {pages.map((page) => (
                        <option key={page} value={page}>
                          {page}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {filteredStats.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground mb-4">
                      <Filter className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      No statistics found
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      {searchTerm || selectedPage !== "ALL" 
                        ? "Try adjusting your filters" 
                        : "Add your first statistic using the form"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredStats.map((stat) => {
                      const isEditing = editingId === stat.id;

                      return (
                        <Card 
                          key={stat.id} 
                          className={`overflow-hidden border border-border ${isEditing ? 'ring-2 ring-primary' : ''} shadow-card hover:shadow-elevated transition-shadow duration-300`}
                        >
                          <CardContent className="p-6">
                            {isEditing ? (
                              <div className="space-y-4">
                                <Input
                                  placeholder="Label"
                                  value={editData?.label || ""}
                                  onChange={(e) =>
                                    setEditData({ ...editData!, label: e.target.value })
                                  }
                                  className="w-full bg-input border-border text-foreground"
                                />
                                
                                <Input
                                  placeholder="Value"
                                  value={editData?.value || ""}
                                  onChange={(e) =>
                                    setEditData({ ...editData!, value: e.target.value })
                                  }
                                  className="w-full bg-input border-border text-foreground"
                                />
                                
                                <select
                                  value={editData?.page || "HOME"}
                                  onChange={(e) =>
                                    setEditData({ ...editData!, page: e.target.value as any })
                                  }
                                  className="w-full border border-border rounded-md px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                  <option value="HOME">Home Page</option>
                                  <option value="ABOUT">About Page</option>
                                  <option value="TESTIMONIALS">Testimonials Page</option>
                                </select>
                                
                                <div className="flex justify-end gap-2 pt-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => saveEdit(stat.id)}
                                    disabled={!editData?.label || !editData?.value}
                                    className="bg-gradient-gold hover:bg-gradient-gold/90 text-charcoal font-semibold"
                                  >
                                    <Save size={14} className="mr-1" /> Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingId(null);
                                      setEditData(null);
                                    }}
                                    className="border-border hover:bg-secondary"
                                  >
                                    <X size={14} className="mr-1" /> Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex justify-between items-start mb-4">
                                  <Badge 
                                    className={`${getPageBadgeColor(stat.page)}`}
                                  >
                                    {stat.page}
                                  </Badge>
                                  
                                  <div className="flex gap-1">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 hover:bg-secondary border border-transparent hover:border-border"
                                      onClick={() => {
                                        setEditingId(stat.id);
                                        setEditData({
                                          label: stat.label,
                                          value: stat.value,
                                          page: stat.page,
                                        });
                                      }}
                                    >
                                      <Pencil size={14} className="text-foreground" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 hover:bg-destructive/10 border border-transparent hover:border-destructive/20 text-destructive hover:text-destructive"
                                      onClick={() => deleteStat(stat.id)}
                                    >
                                      <Trash2 size={14} />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="text-sm text-muted-foreground">Label</div>
                                  <div className="font-semibold text-lg text-foreground">{stat.label}</div>
                                  
                                  <div className="text-sm text-muted-foreground mt-4">Value</div>
                                  <div className="font-bold text-2xl text-gradient-gold">{stat.value}</div>
                                </div>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {/* PAGE FILTER TABS */}
                {stats.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border">
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Button
                        variant={selectedPage === "ALL" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPage("ALL")}
                        className={`${selectedPage === "ALL" ? 'bg-gradient-gold text-charcoal' : 'border-border hover:bg-secondary'}`}
                      >
                        All ({stats.length})
                      </Button>
                      {pages.map((pageOption) => {
                        const count = stats.filter(s => s.page === pageOption).length;
                        return (
                          <Button
                            key={pageOption}
                            variant={selectedPage === pageOption ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedPage(pageOption)}
                            className={`gap-2 ${selectedPage === pageOption ? 'bg-gradient-gold text-charcoal' : 'border-border hover:bg-secondary'}`}
                          >
                            {pageOption}
                            <Badge 
                              variant="secondary" 
                              className={`ml-1 ${selectedPage === pageOption ? 'bg-charcoal text-primary' : 'bg-secondary text-muted-foreground'}`}
                            >
                              {count}
                            </Badge>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStats;