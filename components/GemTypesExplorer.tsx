'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Leaf, MessageCircle, Orbit, Sparkles } from 'lucide-react';
import GemVisual from './GemVisual';
import { GEM_GROUPS, gemTypes, type GemGroup } from '@/data/gemTypes';
import { openAstroChat } from '@/lib/chatEvents';
import { cn } from '@/lib/utils';

type Filter = GemGroup | 'all';

export default function GemTypesExplorer() {
  const [filter, setFilter] = useState<Filter>('all');
  const groups = filter === 'all' ? GEM_GROUPS : GEM_GROUPS.filter((group) => group.id === filter);

  return (
    <div>
      {/* Filter tabs */}
      <div className="sticky top-[72px] z-30 -mx-4 mb-10 overflow-x-auto border-b border-sand-200 bg-sand-50/90 px-4 py-3 backdrop-blur lg:top-32">
        <div className="flex min-w-max gap-2">
          {([{ id: 'all', name: 'All gemstones' }, ...GEM_GROUPS] as Array<{ id: Filter; name: string }>).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                filter === tab.id ? 'bg-royal-700 text-white shadow-soft' : 'bg-white text-navy-900/65 hover:text-royal-700',
              )}
            >
              {tab.name}
              <span className={cn('ml-1.5 text-xs', filter === tab.id ? 'text-white/70' : 'text-navy-900/35')}>
                {tab.id === 'all' ? gemTypes.length : gemTypes.filter((gem) => gem.group === tab.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-16">
        {groups.map((group) => (
          <section key={group.id} id={group.id} className="scroll-mt-48">
            <div className="mb-7 max-w-3xl">
              <p className="eyebrow text-royal-700">{group.hindi}</p>
              <h2 className="h-display mt-2 text-3xl text-navy-900 sm:text-4xl">{group.name}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-navy-900/60">{group.description}</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {gemTypes
                .filter((gem) => gem.group === group.id)
                .map((gem) => (
                  <article
                    key={gem.slug}
                    id={gem.slug}
                    className="flex scroll-mt-48 flex-col overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift"
                  >
                    <div
                      className="relative flex items-center gap-4 p-5"
                      style={{ background: `linear-gradient(135deg, ${gem.art.light}33, #ffffff 70%)` }}
                    >
                      <span className="grid h-20 w-20 shrink-0 place-items-center">
                        <GemVisual art={gem.art} seed={`guide-${gem.slug}`} />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-2xl font-semibold leading-tight text-navy-900">{gem.name}</h3>
                        <p className="text-sm italic text-navy-900/55">{gem.hindi}</p>
                        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-royal-700">
                          <Orbit className="h-3 w-3" /> {gem.planet}
                        </p>
                      </div>
                      {gem.organic && (
                        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                          <Leaf className="h-3 w-3" /> Organic
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5 pt-3">
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                        <div>
                          <dt className="font-semibold uppercase tracking-wider text-navy-900/40">Colour</dt>
                          <dd className="mt-0.5 text-navy-900/75">{gem.colour}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold uppercase tracking-wider text-navy-900/40">Hardness</dt>
                          <dd className="mt-0.5 text-navy-900/75">{gem.hardness} Mohs</dd>
                        </div>
                        <div>
                          <dt className="font-semibold uppercase tracking-wider text-navy-900/40">Origin</dt>
                          <dd className="mt-0.5 text-navy-900/75">{gem.origin}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold uppercase tracking-wider text-navy-900/40">Rashi</dt>
                          <dd className="mt-0.5 text-navy-900/75">
                            {gem.rashi.length > 0 ? gem.rashi.join(', ') : 'By birth chart only'}
                          </dd>
                        </div>
                        <div className="col-span-2">
                          <dt className="font-semibold uppercase tracking-wider text-navy-900/40">How to wear</dt>
                          <dd className="mt-0.5 text-navy-900/75">
                            {gem.wear.finger} · {gem.wear.metal} · {gem.wear.day}
                          </dd>
                        </div>
                      </dl>

                      <ul className="mt-4 space-y-1.5 text-sm text-navy-900/70">
                        {gem.benefits.map((benefit) => (
                          <li key={benefit} className="flex gap-2">
                            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>

                      {gem.substitutes && (
                        <p className="mt-4 text-xs text-navy-900/50">
                          <span className="font-semibold text-navy-900/70">Substitutes:</span> {gem.substitutes.join(', ')}
                        </p>
                      )}

                      <div className="mt-auto flex gap-2 pt-5">
                        {gem.productSlug ? (
                          <Link href={`/product/${gem.productSlug}`} className="btn btn-sm btn-primary flex-1">
                            {gem.shopLabel ?? `Shop ${gem.name}`} <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        ) : (
                          <Link href={`/support?topic=enquiry&gem=${encodeURIComponent(gem.name)}`} className="btn btn-sm btn-primary flex-1">
                            Request this stone
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => openAstroChat(`Is ${gem.name} (${gem.hindi}) right for me? What should I know before wearing it?`)}
                          className="btn btn-sm btn-outline"
                          aria-label={`Ask the astrology assistant about ${gem.name}`}
                        >
                          <MessageCircle className="h-3.5 w-3.5" /> Ask
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
