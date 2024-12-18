import { Label } from "@/components/forms/label";

export const RequiredLabel: React.FC<{
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}> = ({ htmlFor, children, className }) => (
  <Label htmlFor={htmlFor} className={className}>
    {children} <span className="text-sm text-info">*</span>
  </Label>
);
