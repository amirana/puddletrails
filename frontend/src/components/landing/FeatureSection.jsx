const FeatureSection = ({
    eyebrow,
    number,
    title,
    description,
    supportingText,
    preview,
}) => {
    return (
        <section className="border-t border-slate-200 bg-white px-6 py-24 text-left sm:py-32">
            <div className="mx-auto max-w-6xl">
                <div className="grid items-center gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
                    <div className="max-w-sm">
                        <p className="text-sm font-bold tracking-[0.14em] text-emerald-700">
                            {number} / {eyebrow}
                        </p>
                        <h2 className="mt-6 max-w-md text-3xl font-semibold leading-[1.08] tracking-[-0.045em] !text-slate-950 sm:text-4xl">
                            {title}
                        </h2>
                        <p className="mt-7 text-base leading-relaxed text-slate-600">
                            {description}
                        </p>
                        <p className="mt-8 border-l-2 border-emerald-500 pl-4 text-sm font-semibold leading-relaxed text-slate-800">
                            {supportingText}
                        </p>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.09)] sm:p-4">
                        <div className="absolute -right-20 -top-24 h-52 w-52 rounded-full bg-emerald-100/80 blur-3xl" />
                        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-xs font-bold text-white">T</span>
                                    <div>
                                        <p className="text-xs font-bold tracking-[0.12em] text-emerald-700">{preview.label}</p>
                                        <p className="mt-0.5 text-sm font-semibold text-slate-900">{preview.title}</p>
                                    </div>
                                </div>
                                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">Shared trip</span>
                            </div>

                            <div className="grid gap-4 p-4 sm:grid-cols-[1fr_0.82fr] sm:p-5">
                                <div className="space-y-3">
                                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <div className="flex items-start gap-3">
                                            <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{preview.primary}</p>
                                                <p className="mt-1 text-xs text-slate-500">{preview.detail}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <div className="flex items-start gap-3">
                                            <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-amber-400" />
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{preview.secondary}</p>
                                                <p className="mt-1 text-xs text-slate-500">Added to your shared plan</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex min-h-44 flex-col justify-between rounded-xl bg-slate-950 p-5 text-white">
                                    <div>
                                        <p className="text-xs font-bold tracking-[0.12em] text-emerald-300">AT A GLANCE</p>
                                        <p className="mt-3 text-lg font-semibold leading-tight">{preview.title}</p>
                                    </div>
                                    <div>
                                        <div className="flex -space-x-2">
                                            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-950 bg-rose-300 text-[10px] font-bold text-rose-950">M</span>
                                            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-950 bg-amber-200 text-[10px] font-bold text-amber-950">J</span>
                                            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-950 bg-sky-300 text-[10px] font-bold text-sky-950">A</span>
                                        </div>
                                        <p className="mt-3 text-xs text-slate-400">{preview.detail}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
