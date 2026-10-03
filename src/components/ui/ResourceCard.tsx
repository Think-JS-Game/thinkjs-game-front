import React from 'react';
import { Video, FileText, ExternalLink } from 'lucide-react';

export type ResourceKind = 'video' | 'article';

interface ResourceCardProps {
  kind: ResourceKind;
  title: string;
  url: string;
  description?: string;
  className?: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  kind,
  title,
  url,
  description,
  className = '',
}) => {
  const isVideo = kind === 'video';
  const Icon = isVideo ? Video : FileText;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--yellow)] transition-all shadow-sm hover:shadow-md min-h-[72px] ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isVideo
                ? 'bg-[var(--coral-light)]/40 text-[var(--coral)] border border-[var(--coral)]'
                : 'bg-[var(--turquesa-light)]/40 text-[var(--turquesa)] border border-[var(--turquesa)]'
            }`}
          >
            <Icon className="w-5 h-5 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              {isVideo ? 'Vídeo Explicativo' : 'Artigo de Apoio'}
            </div>
            <h4 className="font-extrabold text-base display-md text-[var(--foreground)]">{title}</h4>
            {description && <p className="text-xs text-[var(--muted-foreground)]">{description}</p>}
          </div>
        </div>

        <ExternalLink className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0 mt-1" />
      </div>
    </a>
  );
};
