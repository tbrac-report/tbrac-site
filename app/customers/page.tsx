"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { Header } from "@/components/header";
import { useCustomers } from "@/hooks/use-customers";
import {
  IndustrySector,
  OwnershipType,
} from "@/lib/api-types";
import {
  formatIndustrySector,
  formatOwnershipType,
  formatDate,
} from "@/lib/format-utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Plus,
  MoreHorizontal,
  Building2,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function CustomersContent() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [industrySector, setIndustrySector] = useState<string>("");
  const [ownershipType, setOwnershipType] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, industrySector, ownershipType]);

  const { data, loading, error } = useCustomers({
    page,
    pageSize: 10,
    search: debouncedSearch || undefined,
    industrySector: industrySector || undefined,
    ownershipType: ownershipType || undefined,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Customers</h1>
              <p className="text-muted-foreground mt-1">
                Manage customer records and their documents
              </p>
            </div>
            <Button onClick={() => router.push("/customers/new")}>
              <Plus className="mr-2 h-4 w-4" />
              New Customer
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={industrySector}
                  onValueChange={(val) =>
                    setIndustrySector(val === "all" ? "" : val)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="All Industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {Object.values(IndustrySector).map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {formatIndustrySector(sector)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={ownershipType}
                  onValueChange={(val) =>
                    setOwnershipType(val === "all" ? "" : val)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="All Ownership" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ownership</SelectItem>
                    {Object.values(OwnershipType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {formatOwnershipType(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Customer Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                {data ? `${data.total} Customer${data.total !== 1 ? "s" : ""}` : "Customers"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="text-center py-8 text-red-600">
                  <p>Failed to load customers: {error}</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              )}

              {loading && (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-5 w-[200px]" />
                      <Skeleton className="h-5 w-[120px]" />
                      <Skeleton className="h-5 w-[100px]" />
                      <Skeleton className="h-5 w-[100px]" />
                      <Skeleton className="h-5 w-[80px]" />
                    </div>
                  ))}
                </div>
              )}

              {!loading && !error && data && data.items.length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No customers found</h3>
                  <p className="mt-2 text-muted-foreground">
                    {debouncedSearch || industrySector || ownershipType
                      ? "Try adjusting your filters."
                      : "Get started by creating your first customer."}
                  </p>
                  {!debouncedSearch && !industrySector && !ownershipType && (
                    <Button
                      className="mt-4"
                      onClick={() => router.push("/customers/new")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      New Customer
                    </Button>
                  )}
                </div>
              )}

              {!loading && !error && data && data.items.length > 0 && (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Chinese Name</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead className="hidden sm:table-cell">Ownership</TableHead>
                        <TableHead className="hidden lg:table-cell">HQ Country</TableHead>
                        <TableHead className="hidden lg:table-cell">Created</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.items.map((customer) => (
                        <TableRow
                          key={customer.id}
                          className="cursor-pointer"
                          onClick={() => router.push(`/customers/${customer.id}`)}
                        >
                          <TableCell className="font-medium">
                            {customer.name}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {customer.chinese_name || "—"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {formatIndustrySector(customer.industry_sector)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="secondary">
                              {formatOwnershipType(customer.ownership_type)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {customer.headquarters_country}
                            {customer.headquarters_city
                              ? `, ${customer.headquarters_city}`
                              : ""}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground">
                            {formatDate(customer.created_at)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/customers/${customer.id}`);
                                  }}
                                >
                                  <Building2 className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(
                                      `/customers/${customer.id}/documents`,
                                    );
                                  }}
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  Documents
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {data.total_pages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Page {data.page} of {data.total_pages}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page <= 1}
                          onClick={() => setPage((p) => p - 1)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page >= data.total_pages}
                          onClick={() => setPage((p) => p + 1)}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <ProtectedRoute>
      <CustomersContent />
    </ProtectedRoute>
  );
}
