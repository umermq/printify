import { useState } from "react";
import { cmsPages, type CMSPage } from "@/data/cms-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { FileText, Pencil } from "lucide-react";

const CMSPagesPage = () => {
  const [pages, setPages] = useState<CMSPage[]>(cmsPages);
  const [editing, setEditing] = useState<CMSPage | null>(null);

  const handleSave = () => {
    if (!editing) return;
    setPages((prev) => prev.map((p) => (p.slug === editing.slug ? { ...editing, updatedAt: new Date().toISOString().split("T")[0] } : p)));
    setEditing(null);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">CMS Pages</h1>
          <p className="text-sm text-muted-foreground">Manage website content pages</p>
        </div>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.slug}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {page.title}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">/{page.slug}</TableCell>
                <TableCell>
                  <Badge variant={page.status === "published" ? "default" : "secondary"}>
                    {page.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{page.updatedAt}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => setEditing({ ...page })}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit: {editing?.title}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">SEO Title</label>
                <Input value={editing.metaTitle} onChange={(e) => setEditing({ ...editing, metaTitle: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">SEO Description</label>
                <Textarea value={editing.metaDescription} onChange={(e) => setEditing({ ...editing, metaDescription: e.target.value })} rows={2} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">URL Slug</label>
                <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Content (HTML)</label>
                <Textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={12} className="font-mono text-xs" />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editing.status === "published"} onCheckedChange={(checked) => setEditing({ ...editing, status: checked ? "published" : "draft" })} />
                <span className="text-sm">{editing.status === "published" ? "Published" : "Draft"}</span>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CMSPagesPage;
