

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const fetchAdmins = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admins", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setAdmins(data);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async () => {
  if (!form.email || !form.password) return alert("Email and Password required");
  setLoading(true);
  try {
    const res = await fetch("http://localhost:5000/api/admins/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setForm({ name: "", email: "", password: "" }); // ✅ fix here
    fetchAdmins();
  } catch (error) {
    alert("Error adding admin: " + error.message);
  } finally {
    setLoading(false);
  }
};


  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    try {
      await fetch(`http://localhost:5000/api/admins/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchAdmins();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <Card className="mt-10 mx-8 shadow-lg">
      <CardHeader>
        <CardTitle>Super Admin: Manage Admins</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Admin Name"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Input
            placeholder="Admin Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button onClick={handleAddAdmin} disabled={loading}>
            {loading ? "Adding..." : "Add Admin"}
          </Button>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Existing Admins</h2>
          <ul className="space-y-2">
            {admins.map((admin) => (
              <li
                key={admin._id}
                className="flex justify-between items-center p-3 border rounded bg-white"
              >
                <div>
                  <p className="font-medium">{admin.email}</p>
                  <p className="text-sm text-gray-500">
                    {admin.isSuperAdmin ? "Super Admin" : "Admin"}
                  </p>
                </div>
                {!admin.isSuperAdmin && (
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(admin._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
