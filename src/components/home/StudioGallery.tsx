import SectionHeading from '../ui/SectionHeading';
import GalleryCard from './GalleryCard';

const GALLERY = [
  { src: '/master/studio-front.jpg', title: '道易天机国学馆', desc: 'Our sacred space where readings and rituals are performed.', large: true },
  { src: '/master/certificate.jpg', title: 'Official Certification', desc: '高级预测风水师 · Issued by 大英易学文化研究会', large: true },
  { src: '/master/master-ceremony.jpg', title: "Master's Ritual · 道场仪式", desc: 'Sacred ceremony in the Daoist tradition.' },
  { src: '/master/altar-ritual.jpg', title: 'Sacred Altar · 祭坛', desc: 'Offerings and blessings at the altar.' },
  { src: '/master/groundbreaking.jpg', title: 'Site Blessing · 开工仪式', desc: 'Ground-breaking ceremony for new beginnings.' },
  { src: '/master/tools-collection.jpg', title: 'Sacred Tools · 风水器具', desc: 'Traditional Feng Shui instruments and tools.' },
  { src: '/master/taisui-chart.jpg', title: 'Tai Sui · 太岁图', desc: 'The Grand Duke Jupiter chart for annual readings.', small: true },
];

export default function StudioGallery() {
  return (
    <section id="gallery" className="py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          label="Sacred Spaces"
          title="Our Studio & Sacred Work"
          subtitle="道易天机国学馆 · Where Ancient Wisdom Lives"
          className="mb-12"
        />

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          {GALLERY.filter(g => g.large).map(g => (
            <GalleryCard key={g.src} {...g} />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {GALLERY.filter(g => !g.large).map(g => (
            <GalleryCard key={g.src} {...g} />
          ))}
        </div>
      </div>
    </section>
  );
}
