import { useState } from "react";
import { faqItems as initialFaqs, faqCategories, type FAQItem } from "@/data/cms-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";

const FAQsAdminPage = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFaqs);
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  const openNew = () => {
    setIsNew(true);
    setEditing({ id: `faq-${Date.now()}`, question: "", answer: "", category: "Orders", order: faqs.length + 1 });
  };

  const handleSave = () => {
    if (!editing) return;
    if (isNew) {
      setFaqs((prev) => [...prev, editing]);
    } else {
      setFaqs((prev) => prev.map((f) => (f.id === editing.id ? editing : f)));
    }
    setEditing(null);
    setIsNew(false);
  };

  const handleDelete = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">FAQ Management</h1>
          <p className="text-sm text-muted-foreground">{faqs.length} questions across {faqCategories.length} categories</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Add FAQ</Button>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.map((faq) => (
              <TableRow key={faq.id}>
                <TableCell className="font-medium max-w-md truncate">{faq.question}</TableCell>
                <TableCell><Badge variant="secondary">{faq.category}</Badge></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setIsNew(false); setEditing({ ...faq }); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(faq.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editing} onOpenChange={() => { setEditing(null); setIsNew(false); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNew ? "Add FAQ" : "Edit FAQ"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Question</label>
                <Input value={editing.question} onChange={(e) => setEditing({ ...editing, question: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Answer</label>
                <Textarea value={editing.answer} onChange={(e) => setEditing({ ...editing, answer: e.target.value })} rows={4} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Category</label>
                <Select value={editing.category} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {faqCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => { setEditing(null); setIsNew(false); }}>Cancel</Button>
                <Button onClick={handleSave}>{isNew ? "Add" : "Save"}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FAQsAdminPage;
