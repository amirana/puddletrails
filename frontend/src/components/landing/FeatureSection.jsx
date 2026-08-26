const FeatureSection = ({
    eyebrow,
    number,
    title,
    description,
    supportingText,
    image,
    imageAlt,
}) => {
    return (
        <section className="border-t border-black/10 bg-white px-6 py-24 text-left sm:py-32">
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-12 md:grid-cols-2 md:gap-24">
                    <div className="flex flex-col gap-4">
                        <span className="text-xs font-medium tracking-[0.16em] text-[#6b6375]">
                            {number} — {eyebrow}
                        </span>
                        <h2 className="m-0 max-w-md text-4xl font-semibold leading-tight tracking-tight !text-[#08060d] sm:text-5xl">
                            {title}
                        </h2>
                    </div>

                    <div className="flex max-w-xl flex-col gap-4">
                        <p className="text-base leading-relaxed text-[#6b6375] sm:text-lg">
                            {description}
                        </p>
                        <p className="text-sm font-medium text-[#4d8063] sm:text-base">
                            {supportingText}
                        </p>
                    </div>
                </div>

                <div className="mt-16 overflow-hidden rounded-xl border border-black/10 bg-[#f8f8f8]">
                    <img className="block w-full" src={image} alt={imageAlt} />
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
