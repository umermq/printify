import { useState } from "react";
import { contactSubmissions as initialSubmissions, type ContactSubmission } from "@/data/cms-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, MailOpen } from "lucide-react";

const ContactSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(initialSubmissions);
  const [viewing, setViewing] = useState<ContactSubmission | null>(null);

  const toggleRead = (id: string) => {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, read: !s.read } : s)));
  };

  const openSubmission = (sub: ContactSubmission) => {
    setViewing(sub);
    if (!sub.read) toggleRead(sub.id);
  };

  const unreadCount = submissions.filter((s) => !s.read).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Contact Submissions</h1>
        <p className="text-sm text-muted-foreground">{submissions.length} total · {unreadCount} unread</p>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((sub) => (
              <TableRow key={sub.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openSubmission(sub)}>
                <TableCell>{sub.read ? <MailOpen className="h-4 w-4 text-muted-foreground" /> : <Mail className="h-4 w-4 text-primary" />}</TableCell>
                <TableCell className={sub.read ? "text-muted-foreground" : "font-medium"}>{sub.name}</TableCell>
                <TableCell className="text-muted-foreground">{sub.email}</TableCell>
                <TableCell className="text-muted-foreground">{sub.phone}</TableCell>
                <TableCell className="text-muted-foreground">{sub.date}</TableCell>
                <TableCell>
                  <Badge variant={sub.read ? "secondary" : "default"}>{sub.read ? "Read" : "New"}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message from {viewing?.name}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Email:</span> {viewing.email}</div>
                <div><span className="text-muted-foreground">Phone:</span> {viewing.phone}</div>
                <div><span className="text-muted-foreground">Date:</span> {viewing.date}</div>
              </div>
              <div className="rounded-lg bg-muted p-4 text-sm">{viewing.message}</div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => { toggleRead(viewing.id); setViewing(null); }}>
                  Mark as {viewing.read ? "Unread" : "Read"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactSubmissionsPage;
