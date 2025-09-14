// src/components/InertiaPagination.tsx
import * as React from "react";
import { Link } from "@inertiajs/react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationEllipsis,
} from "@/components/ui/pagination";

// Base (no background here to avoid conflicts)
const baseLink =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

// Background variants
const inactiveBg = "bg-background";
const activeBg = "bg-accent text-accent-foreground";

const disabledLink = "pointer-events-none opacity-50";

type LinkItem = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    links?: LinkItem[];       // when controller uses ->toArray(): users.links
    metaLinks?: LinkItem[];   // when sending raw paginator: users.meta.links
    prevPageUrl?: string | null;
    nextPageUrl?: string | null;

    preserveScroll?: boolean;
    preserveState?: boolean | "errors";
    only?: string[];

    labels?: {
        previous?: string;
        next?: string;
        ellipsis?: string;
    };
};

export function InertiaPagination({
                                      links,
                                      metaLinks,
                                      prevPageUrl,
                                      nextPageUrl,
                                      preserveScroll = true,
                                      preserveState = true,
                                      only,
                                      labels,
                                  }: Props) {
    const raw = (Array.isArray(links) && links.length)
        ? links
        : (Array.isArray(metaLinks) && metaLinks.length)
            ? metaLinks
            : undefined;

    let first: LinkItem | undefined;
    let last: LinkItem | undefined;
    let pageItems: LinkItem[] = [];

    if (raw && raw.length >= 2) {
        first = raw[0];
        last = raw[raw.length - 1];
        pageItems = raw.slice(1, -1);
    } else {
        first = { url: prevPageUrl ?? null, label: "Previous", active: false };
        last  = { url: nextPageUrl ?? null, label: "Next", active: false };
        pageItems = [];
    }

    if (!first && !last && pageItems.length === 0) return null;

    const isEllipsis = (label: string) =>
        label.trim() === "..." ||
        label.trim() === "… " ||
        label.trim() === "…" ||
        /&hellip;/.test(label);

    const normalizePageLabel = (label: string) => {
        if (isEllipsis(label)) return labels?.ellipsis ?? "…";
        const n = Number(label);
        if (!Number.isNaN(n)) return String(n);
        return label;
    };

    const renderLink = (
        href: string | null,
        children: React.ReactNode,
        opts?: { active?: boolean; rel?: string; ariaLabel?: string }
    ) => {
        const cls = [
            baseLink,
            opts?.active ? activeBg : inactiveBg,
            !href ? disabledLink : "",
        ]
            .filter(Boolean)
            .join(" ");

        if (!href) {
            return (
                <span aria-disabled className={cls}>
          {children}
        </span>
            );
        }

        return (
            <Link
                href={href}
                className={cls}
                preserveScroll={preserveScroll}
                preserveState={preserveState}
                {...(only ? { only } : {})}
                {...(opts?.rel ? { rel: opts.rel } : {})}
                {...(opts?.ariaLabel ? { "aria-label": opts.ariaLabel } : {})}
            >
                {children}
            </Link>
        );
    };

    return (
        <Pagination>
            <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                    {renderLink(
                        first?.url ?? null,
                        labels?.previous ?? "Previous",
                        { rel: "prev", ariaLabel: labels?.previous ?? "Previous" }
                    )}
                </PaginationItem>

                {/* Pages */}
                {pageItems.map((l, idx) => {
                    if (isEllipsis(l.label)) {
                        return (
                            <PaginationItem key={`e-${idx}`}>
                <span className={[baseLink, inactiveBg].join(" ")} aria-hidden>
                  {labels?.ellipsis ?? "…"}
                </span>
                            </PaginationItem>
                        );
                    }

                    const label = normalizePageLabel(l.label);
                    return (
                        <PaginationItem key={`${label}-${idx}`}>
                            {renderLink(l.url, label, {
                                active: l.active,
                                ariaLabel: l.active
                                    ? `Page ${label}, current`
                                    : `Go to page ${label}`,
                            })}
                        </PaginationItem>
                    );
                })}

                {/* Next */}
                <PaginationItem>
                    {renderLink(
                        last?.url ?? null,
                        labels?.next ?? "Next",
                        { rel: "next", ariaLabel: labels?.next ?? "Next" }
                    )}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

export default InertiaPagination;
