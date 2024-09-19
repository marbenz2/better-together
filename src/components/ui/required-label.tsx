import { Label } from '@/components/forms/label'

export const RequiredLabel: React.FC<{ htmlFor: string; children: React.ReactNode }> = ({
  htmlFor,
  children,
}) => (
  <Label htmlFor={htmlFor}>
    {children} <span className="text-sm text-info">*</span>
  </Label>
)
