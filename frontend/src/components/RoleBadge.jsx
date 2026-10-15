import React from 'react';
import { ShieldCheck, Landmark, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ROLE_META = {
  GOVERNMENT_HQ: { text: 'GOV HQ', Icon: Landmark },
  REGISTRAR: { text: 'REGISTRAR', Icon: ShieldCheck },
  CITIZEN: { text: 'CITIZEN', Icon: User },
};

export default function RoleBadge({ role, className = '' }) {
  if (!role) return null;
  const meta = ROLE_META[role] || { text: role, Icon: User };
  const { Icon } = meta;

  return (
    <Badge
      variant="outline"
      className={cn(
        'w-fit border-primary/20 bg-primary/10 text-[0.62rem] font-extrabold uppercase tracking-wide text-primary',
        className
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {meta.text}
    </Badge>
  );
}
