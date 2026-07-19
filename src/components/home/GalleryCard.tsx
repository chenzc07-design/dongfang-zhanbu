interface GalleryCardProps {
  src: string;
  title: string;
  desc?: string;
  large?: boolean;
  small?: boolean;
}

export default function GalleryCard({ src, title, desc, large, small }: GalleryCardProps) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden group">
      <div className={`overflow-hidden ${small ? 'h-36' : 'h-56'}`}>
        <img
          src={src}
          alt={title}
          className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <p className="text-[#ede4d8] text-sm font-semibold mb-1">{title}</p>
        {desc && <p className="text-[#7e7264] text-xs">{desc}</p>}
      </div>
    </div>
  );
}
