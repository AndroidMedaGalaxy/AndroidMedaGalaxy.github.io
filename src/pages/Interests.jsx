import React, {useState, useEffect} from 'react';

const interests = [
    {
        name: 'Motorcycling',
        description: 'Exploring the freedom of the road, touring, and maintaining motorcycles.',
        tags: ['Adventure', 'Mechanics', 'Travel'],
        images: ['images/droidmeda/mascot_riding_motorcycle.png',
            'images/motorcycling/motorcycle_1.jpg',
            'images/motorcycling/motorcycle_2.jpg',
            'images/motorcycling/motorcycle_3.jpg',
            'images/motorcycling/motorcycle_4.jpg',
            'images/motorcycling/motorcycle_5.jpg',
        ],
    },
    {
        name: 'PC Building and custom hardware setups',
        description: 'Building custom PCs for performance, gaming, and productivity. Always on the lookout for the latest hardware. Building Home assistant Server for Home Automation',
        tags: ['Hardware', 'DIY', 'Performance'],
        images: ['images/droidmeda/mascot_building_pc.png'],
    },
    {
        name: 'Gamer',
        description: 'Passionate about gaming across platforms, especially strategy and open world titles.',
        tags: ['Gaming', 'Strategy', 'Open World'],
        images: ['images/droidmeda/mascot_gaming.png'],
    },
    {
        name: 'Tinkering with Tech',
        description: 'Hands-on with electronics, IoT, and new gadgets. Always learning and experimenting.',
        tags: ['Tech Enthusiast', 'Electronics', 'IoT'],
        images: ['images/droidmeda/mascot_tinkering.png'],
    },
    {
        name: 'Dog Training',
        description: 'Training dogs for obedience, agility, and companionship. Discovering new techniques daily.',
        tags: ['Pets', 'Training', 'Companionship'],
        images: ['images/droidmeda/mascot_training_dog_2.png'],
    },
];

function InterestGallery({images}) {
    const [idx, setIdx] = useState(0);
    if (!images || images.length === 0) return null;
    return (
        <div className="relative">
            <div
                className="h-40 w-full overflow-hidden rounded-t-xl border-b border-slate-800 bg-slate-950 flex items-center justify-center">
                <img src={import.meta.env.BASE_URL + images[idx]} alt="Interest gallery"
                     className="object-contain h-full w-full transition-all duration-500"/>
            </div>
            {images.length > 1 && (
                <div className="flex items-center justify-center gap-4 py-2">
                    <button
                        onClick={() => setIdx((idx - 1 + images.length) % images.length)}
                        className="bg-black/60 text-white font-bold text-2xl rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/80 shadow-md"
                        aria-label="Previous"
                    >
                        &#8592;
                    </button>
                    <div className="flex gap-2">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                className={`inline-block w-4 h-4 rounded-full border-2 border-teal-400 ${i === idx ? 'bg-teal-400' : 'bg-slate-900'}`}
                                onClick={() => setIdx(i)}
                                aria-label={`Go to image ${i + 1}`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={() => setIdx((idx + 1) % images.length)}
                        className="bg-black/60 text-white font-bold text-2xl rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/80 shadow-md"
                        aria-label="Next"
                    >
                        &#8594;
                    </button>
                </div>
            )}
        </div>
    );
}

function CardImage({images, title}) {
    // State to track image load error
    const [imgError, setImgError] = useState(false);
    // Select main image
    const mainImg = images && images.length > 0 ? images[0] : null;
    if (imgError || !mainImg) {
        return (
            <div
                className="h-40 w-full flex items-center justify-center rounded-t-xl border-b border-slate-800 bg-gradient-to-br from-teal-700 via-slate-800 to-slate-950">
                <span className="text-lg font-bold text-slate-100 drop-shadow text-center px-4">{title}</span>
            </div>
        );
    }
    return (
        <div
            className="h-40 w-full overflow-hidden rounded-t-xl border-b border-slate-800 bg-slate-950 flex items-center justify-center">
            <img
                src={import.meta.env.BASE_URL + mainImg}
                alt={title}
                className="object-contain h-full w-full"
                onError={() => setImgError(true)}
            />
        </div>
    );
}

export default function Interests() {
    return (
        <main className="mx-auto max-w-5xl px-4 pb-12 pt-8">
            <h1 className="text-3xl font-bold text-slate-50">Interests</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
                A few passions and hobbies outside of work—always learning, exploring, and having fun!
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {interests.map(interest => (
                    <div key={interest.name}
                         className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/70 shadow-lg hover:scale-[1.025] transition-transform">
                        {interest.images && interest.images.length > 1 ? (
                            <InterestGallery images={interest.images}/>
                        ) : (
                            <CardImage images={interest.images} title={interest.name}/>
                        )}
                        <div className="flex-1 p-4 flex flex-col">
                            <h2 className="text-lg font-bold text-teal-300 mb-1">{interest.name}</h2>
                            <p className="text-sm text-slate-200 mb-3">{interest.description}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {interest.tags.map(tag => (
                                    <span key={tag}
                                          className="rounded-full border border-slate-800 bg-slate-900 px-2 py-0.5 text-[11px] text-slate-200">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
