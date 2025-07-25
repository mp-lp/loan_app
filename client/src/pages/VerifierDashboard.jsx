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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
export default function VerifierDashboard() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 
   const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully.");
    navigate("/login");
  };
  useEffect(() => {
    async function fetchLoans() {
      try {
        const response = await fetch("http://localhost:5000/api/loans/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setLoans(data);
      } catch (error) {
        console.error("Error fetching loans:", error);
        toast.error("Failed to fetch loans.");
      } finally {
        setLoading(false);
      }
    }
    fetchLoans();
  }, []);

  const handleUpdateStatus = async (loanId, newStatus) => {
    if (newStatus === "approved") {
      toast.error("You are not authorized to approve loans.");
      return;
    }

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
        throw new Error(errorData.message || "Failed to update status");
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
      toast.success("Loan status updated.");
    } catch (error) {
      console.error("Error updating loan status:", error);
      toast.error(error.message || "Status update failed.");
    }
  };

  const statusClass = (status) => {
    switch (status.toLowerCase()) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-900">
<div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-semibold">Loans Overview</h1>
<div className="flex justify-end p-4 bg-green-800">
  <button
    onClick={handleLogout}
    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow"
  >
    Logout
  </button>
</div>
</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Loans</CardTitle>
            <CreditCard className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loans.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Borrowers</CardTitle>
            <Users className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cash Disbursed</CardTitle>
            <DollarSign className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦550,000</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cash Received</CardTitle>
            <DollarSign className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦1,000,000</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Applied Loans</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Recent Activity</TableHead>
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
                        <div className="font-medium">{loan.loanReason || "Loan Application"}</div>
                        <div className="text-xs text-muted-foreground">Updated 2 days ago</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={loan.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{loan.fullName?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div>{loan.fullName}</div>
                      </div>
                    </TableCell>
                    <TableCell> {loan.createdAt
    ? new Date(loan.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A'}</TableCell>
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
                        onChange={(e) => handleUpdateStatus(loan._id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
