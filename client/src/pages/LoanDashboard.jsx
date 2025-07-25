
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BellIcon, Home, MessageCircle, User, Wallet, CreditCard, Search, Filter, ArrowLeft, ArrowRight, MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LoanDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [balance, setBalance] = useState(0);
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('borrow');

  useEffect(() => {
    const fetchLoans = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/loans/status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch loans');
        const data = await response.json();
        setLoans(data.loans);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error('Error fetching loans:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLoans();
  }, [currentPage, sortField, sortOrder, statusFilter, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1);
  };

  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleTabChange = (value) => setActiveTab(value);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-500';
      case 'verified': return 'bg-green-500';
      case 'rejected': return 'bg-red-600';
      case 'approved': return 'bg-blue-700';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="text-xl font-bold text-green-700">CREDIT APP</div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/application')}>
              Get A Loan
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 text-green-800 rounded-lg px-4 py-2 flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              <div>
                <div className="text-xs uppercase">Deficit</div>
                <div className="text-lg font-semibold">₦{balance.toFixed(1)}</div>
              </div>
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="borrow">Borrow Cash</TabsTrigger>
              <TabsTrigger value="transact">Transact</TabsTrigger>
              <TabsTrigger value="deposit">Deposit Cash</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Search for loans"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan Officer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleSort('status')}>
                    <Filter className="h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : loans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No loans found
                  </TableCell>
                </TableRow>
              ) : (
                loans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={loan.officerImage || "/placeholder.svg"} />
                          <AvatarFallback>{loan.fullName?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <span>{loan.fullName || "John Doe"}</span>
                      </div>
                    </TableCell>
                    <TableCell>{loan.loanAmount.toLocaleString()}</TableCell>
                    <TableCell> {loan.createdAt
    ? new Date(loan.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`text-white text-xs px-3 py-1 rounded-full ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Cancel</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between p-4 border-t text-sm text-muted-foreground">
            <div>Rows per page: 7</div>
            <div className="flex items-center space-x-4">
              <span>{loans.length > 0 ? `1-${loans.length} of ${loans.length}` : '0 of 0'}</span>
              <Button variant="outline" size="icon" onClick={handlePreviousPage} disabled={currentPage === 1 || isLoading}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages || isLoading}>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
