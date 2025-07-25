
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Home,
  Users,
  DollarSign,
  CreditCard,
  FileText,
  Building,
  Settings,
  ChevronDown,
  Bell,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import AdminManagement from "@/components/AdminManagement";

export default function AdminDashboard() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);
    }
  }, []);

  useEffect(() => {
    async function fetchLoans() {
      try {
        const response = await fetch("http://localhost:5000/api/loans/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Unexpected response format");
        setLoans(data);
      } catch (error) {
        console.error("Error fetching loans:", error);
        toast.error("Failed to fetch loan data.");
      } finally {
        setLoading(false);
      }
    }
    fetchLoans();
  }, []);

  const handleUpdateStatus = async (loanId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/loans/update-status/${loanId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Status update failed");
      }

      const updatedLoan = await response.json();

      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan._id === loanId
            ? {
                ...loan,
                status: updatedLoan?.updatedLoanApplication?.status,
              }
            : loan
        )
      );

      toast.success("Loan status updated successfully.");
    } catch (error) {
      console.error("Error updating loan status:", error);
      toast.error(error.message || "Failed to update status.");
    }
  };

  const statusClass = (status) => {
    if (!status || typeof status !== "string") return "bg-gray-100 text-gray-800";
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "verified":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const getAllowedStatuses = () => {
    if (role === "verifier") return ["verified", "rejected"];
    if (role === "admin" || role === "super-admin") return ["approved", "rejected"];
    return [];
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-green-900 text-white flex flex-col">
        <div className="p-6 font-bold text-lg border-b border-white/20">
          CREDIT APP
        </div>
        <div className="flex flex-col gap-2 p-4 text-sm">
          {[Home, Users, CreditCard, DollarSign, FileText, Building, Settings].map(
            (Icon, index) => {
              const labels = [
                "Dashboard",
                "Borrowers",
                "Loans",
                "Repayments",
                "Reports",
                "Accounts",
                "Settings",
              ];
              return (
                <button
                  key={labels[index]}
                  className="flex items-center gap-3 px-4 py-2 rounded hover:bg-green-800"
                >
                  <Icon className="w-4 h-4" />
                  {labels[index]}
                </button>
              );
            }
          )}
          {role === "super-admin" && (
            <button className="flex items-center gap-3 px-4 py-2 rounded hover:bg-green-800 text-yellow-300 font-semibold">
              <Users className="w-4 h-4" />
              Admin Management
            </button>
          )}
        </div>
      
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-semibold">Dashboard</h1>

  <div className="flex items-center gap-4">
    <Bell className="w-5 h-5 text-muted-foreground" />
    <Avatar>
      <AvatarImage src="/avatar.png" />
      <AvatarFallback>AD</AvatarFallback>
    </Avatar>

    <Button variant="ghost" className="text-sm flex items-center gap-1">
      {role.charAt(0).toUpperCase() + role.slice(1)}
      <ChevronDown className="w-4 h-4" />
    </Button>

   
    <button
      onClick={logout}
      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow"
    >
      Logout
    </button>
  </div>
</div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[{ label: "Loans", value: loans.length.toString(), icon: CreditCard }].map((card) => (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
                <card.icon className="w-5 h-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loans Table */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Loans</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Details</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow key={loan._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{loan.loanReason}</div>
                          <div className="text-xs text-muted-foreground">
                            Updated {Math.floor(Math.random() * 10 + 1)} days ago
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={loan.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{loan.fullName?.[0] || "U"}</AvatarFallback>
                          </Avatar>
                          {loan.fullName}
                        </div>
                      </TableCell>
                      <TableCell>
                         {loan.createdAt
    ? new Date(loan.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium",
                            statusClass(loan.status)
                          )}
                        >
                          {loan.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <select
                          value={loan.status}
                          onChange={(e) =>
                            handleUpdateStatus(loan._id, e.target.value)
                          }
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option disabled>Select</option>
                          {getAllowedStatuses().map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Admin Management (super-admin only) */}
        {role === "super-admin" && (
          <div className="mt-8">
            <AdminManagement />
          </div>
        )}
      </main>
    </div>
  );
}

