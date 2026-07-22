import SectionHeading from '../ui/SectionHeading';

export default function VideoSection() {
  return (
    <section className="py-20 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <SectionHeading
          label="Experience"
          title="See the Master at Work"
          subtitle="Witness authentic Daoist rituals and professional BaZi consultations"
          className="mb-10"
        />

        {/* 视频占位区 */}
        <div className="card-warm rounded-2xl overflow-hidden">
          <div className="aspect-video bg-[#f9fafb] flex items-center justify-center relative group cursor-pointer">
            {/* 播放按钮 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center group-hover:bg-[rgba(124,58,237,0.12)] group-hover:border-purple-300 transition-all duration-300 group-hover:scale-110">
                <div className="w-0 h-0 border-l-[22px] border-l-[#7c3aed] border-t-[13px] border-t-transparent border-b-[13px] border-b-transparent ml-1.5" />
              </div>
            </div>
            <p className="text-[#9ca3af] text-sm mt-24 italic">Video coming soon — Master Gao&apos;s sacred rituals</p>
          </div>
        </div>

        {/* 三张预览小图 */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { src: '/master/master-ceremony.jpg', label: 'Daoist Ceremony' },
            { src: '/master/altar-ritual.jpg', label: 'Sacred Altar' },
            { src: '/master/groundbreaking.jpg', label: 'Site Blessing' },
          ].map(item => (
            <div key={item.label} className="card-warm rounded-xl overflow-hidden group cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={item.src} alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <p className="text-center text-[11px] text-[#6b7280] py-2 font-medium tracking-wide">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
