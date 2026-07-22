interface GalleryCardProps {
  src: string;
  title: string;
  desc?: string;
  large?: boolean;
  small?: boolean;
}

export default function GalleryCard({ src, title, desc, large, small }: GalleryCardProps) {
  return (
    <div className="card-warm rounded-2xl overflow-hidden group">
      <div className={`overflow-hidden ${small ? 'h-40' : 'h-56'}`}>
        <img src={src} alt={title}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
      </div>
      <div className="p-4">
        <p className="text-[#1f2937] text-sm font-semibold mb-1">{title}</p>
        {desc && <p className="text-[#9ca3af] text-xs">{desc}</p>}
      </div>
    </div>
  );
}
