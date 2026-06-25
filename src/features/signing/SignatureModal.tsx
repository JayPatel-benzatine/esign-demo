"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { SignatureData } from "@/types/signing";
import { Trash2, RotateCcw, Upload, PenLine, Type } from "lucide-react";

const SIGNATURE_FONTS = [
  { id: "dancing",  name: "Dancing Script", family: "'Dancing Script', cursive" },
  { id: "pacifico", name: "Pacifico",        family: "'Pacifico', cursive" },
  { id: "cookie",   name: "Cookie",          family: "'Cookie', cursive" },
  { id: "satisfy",  name: "Satisfy",         family: "'Satisfy', cursive" },
];

interface SignatureModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (data: SignatureData) => void;
  mode?: "signature" | "initials";
}

export function SignatureModal({ open, onClose, onApply, mode = "signature" }: SignatureModalProps) {
  const [typedText, setTypedText] = useState("");
  const [selectedFont, setSelectedFont] = useState(SIGNATURE_FONTS[0]);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<SignatureCanvas>(null);

  const handleClear = () => {
    canvasRef.current?.clear();
    setPreviewDataUrl(null);
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = canvas.toData();
    if (data.length > 0) { data.pop(); canvas.fromData(data); }
  };

  const handleApply = (activeTab: string) => {
    if (activeTab === "draw") {
      if (!canvasRef.current || canvasRef.current.isEmpty()) return;
      onApply({ type: "draw", dataUrl: canvasRef.current.toDataURL("image/png") });
    } else if (activeTab === "type") {
      if (!typedText.trim()) return;
      const canvas = document.createElement("canvas");
      canvas.width = 400; canvas.height = 120;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, 400, 120);
      ctx.font = `56px ${selectedFont.family}`;
      ctx.fillStyle = "#1a1a2e";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(typedText, 200, 60);
      onApply({ type: "type", dataUrl: canvas.toDataURL(), fontFamily: selectedFont.family, text: typedText });
    } else if (previewDataUrl) {
      onApply({ type: "upload", dataUrl: previewDataUrl });
    }
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewDataUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden gap-0" id="signature-modal">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-sm font-semibold">
            {mode === "initials" ? "Draw Your Initials" : "Create Your Signature"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            This will be applied to the signature field in the document.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="draw" className="flex-1">
          <div className="px-6 pt-4 border-b">
            <TabsList className="bg-transparent p-0 h-auto gap-0">
              {[
                { value: "draw",   label: "Draw",   icon: PenLine },
                { value: "type",   label: "Type",   icon: Type },
                { value: "upload", label: "Upload", icon: Upload },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent text-muted-foreground text-sm font-medium transition-all"
                  id={`sig-tab-${tab.value}`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Draw Tab */}
          <TabsContent value="draw" className="p-6 pt-4 m-0 space-y-3" id="sig-draw-content">
            <div className="signature-canvas-wrapper rounded-xl overflow-hidden border-2 border-dashed">
              <SignatureCanvas
                ref={canvasRef}
                penColor="#1e1e3f"
                canvasProps={{
                  width: 468,
                  height: 180,
                  className: "w-full bg-white",
                  id: "signature-draw-canvas",
                }}
                backgroundColor="white"
              />
            </div>
            <p className="text-[10px] text-muted-foreground text-center">Sign above using your mouse or finger</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleClear} className="flex-1" id="sig-clear-btn">
                <Trash2 className="w-3.5 h-3.5" />Clear
              </Button>
              <Button variant="outline" size="sm" onClick={handleUndo} className="flex-1" id="sig-undo-btn">
                <RotateCcw className="w-3.5 h-3.5" />Undo
              </Button>
            </div>
            <DialogFooter className="pt-2">
              <Button variant="outline" onClick={onClose} id="sig-draw-cancel">Cancel</Button>
              <Button onClick={() => handleApply("draw")} id="sig-draw-apply">
                Apply {mode === "initials" ? "Initials" : "Signature"}
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* Type Tab */}
          <TabsContent value="type" className="p-6 pt-4 m-0 space-y-4" id="sig-type-content">
            <div className="space-y-2">
              <Label htmlFor="sig-type-input">Your Name</Label>
              <Input
                id="sig-type-input"
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder={mode === "initials" ? "e.g. JD" : "Your full name"}
                className="text-center text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label>Signature Style</Label>
              <div className="grid grid-cols-2 gap-2">
                {SIGNATURE_FONTS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setSelectedFont(font)}
                    className={cn(
                      "p-3 rounded-xl border text-center transition-all",
                      selectedFont.id === font.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                    )}
                    id={`sig-font-${font.id}`}
                  >
                    <span className="text-2xl text-foreground" style={{ fontFamily: font.family }}>
                      {typedText || "Signature"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} id="sig-type-cancel">Cancel</Button>
              <Button onClick={() => handleApply("type")} disabled={!typedText.trim()} id="sig-type-apply">
                Apply {mode === "initials" ? "Initials" : "Signature"}
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="p-6 pt-4 m-0" id="sig-upload-content">
            {previewDataUrl ? (
              <div className="space-y-4">
                <img src={previewDataUrl} alt="Signature preview" className="max-h-32 mx-auto rounded-lg border" />
                <Button variant="ghost" size="sm" className="w-full" onClick={() => setPreviewDataUrl(null)}>
                  Remove
                </Button>
              </div>
            ) : (
              <label className="block cursor-pointer" htmlFor="sig-upload-input">
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleFileUpload}
                  id="sig-upload-input"
                />
                <div className="drop-zone p-10 flex flex-col items-center gap-3 rounded-xl">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium">Upload signature image</p>
                    <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG — transparent recommended</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={(e) => e.stopPropagation()}>Browse</Button>
                </div>
              </label>
            )}
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={onClose} id="sig-upload-cancel">Cancel</Button>
              <Button onClick={() => handleApply("upload")} disabled={!previewDataUrl} id="sig-upload-apply">
                Apply {mode === "initials" ? "Initials" : "Signature"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
