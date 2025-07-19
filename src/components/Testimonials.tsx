import React from 'react';
import { Star, Quote, Calendar } from 'lucide-react';

interface TestimonialsProps {
  onNavigate: (page: string) => void;
}

const Testimonials: React.FC<TestimonialsProps> = ({ onNavigate }) => {
  const testimonials = [
    {
      id: 1,
      name: 'Ahmad Wijaya',
      location: 'Telanaipura',
      rating: 5,
      comment: 'Service printer Canon saya sangat memuaskan! Teknisinya datang tepat waktu, profesional, dan printer saya yang tadinya macet total sekarang sudah normal kembali. Harga juga sangat terjangkau. Recommended!',
      printerBrand: 'Canon PIXMA G2010',
      problemSolved: 'Head tersumbat + tinta tidak keluar',
      date: '2025-01-10',
      beforeImage: 'https://ekakom.com/wp-content/uploads/2018/06/Jasa-service-printer-Buaran-3.jpg',
      afterImage: 'https://ekakom.com/wp-content/uploads/2018/06/Jasa-Service-Printer-Jatinegara-1.jpg'
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      location: 'Thehok',
      rating: 5,
      comment: 'Printer Epson L3110 saya bermasalah paper jam terus menerus. Setelah di-service oleh Barokah Printer, masalahnya langsung teratasi. Teknisinya sabar menjelaskan cara maintenance yang benar. Terima kasih!',
      printerBrand: 'Epson L3110',
      problemSolved: 'Paper jam berulang',
      date: '2025-01-08',
      beforeImage: 'https://siopen.hulusungaiselatankab.go.id/storage/merchant/products/2024/10/24/bb6bfb7cf92f69268958b99e97965cc9.jpg',
      afterImage: 'https://parto.id/asset/foto_produk/SERVICE_PRINTER_EPSON_jpg_171144276293.jpg'
    },
    {
      id: 3,
      name: 'Dedi Kurniawan',
      location: 'Simpang Kawat',
      rating: 5,
      comment: 'HP DeskJet saya sudah 2 tahun tidak bisa print warna, hanya hitam putih saja. Setelah dibawa ke Barokah Printer, ternyata masalahnya di cartridge dan head printer. Sekarang bisa print warna lagi dengan sempurna!',
      printerBrand: 'HP DeskJet 2135',
      problemSolved: 'Tidak bisa print warna',
      date: '2025-01-05',
      beforeImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROsB2ZcHZB02-ON_HRI-Z_hrRWbq7yBFzgFN75vgtdo3PcMn4G3oWCbNwW0EMREqUDYgg&usqp=CAU',
      afterImage: 'https://solusiprinter1.wordpress.com/wp-content/uploads/2016/03/service-printer-panggilan.jpg'
    },
    {
      id: 4,
      name: 'Rina Marlina',
      location: 'Kenali Asam Bawah',
      rating: 5,
      comment: 'Brother printer saya error terus dan tidak mau menyala. Saya sudah coba ke tempat service lain tapi tidak bisa diperbaiki. Alhamdulillah Barokah Printer bisa memperbaikinya dengan sempurna. Pelayanan ramah dan harga fair.',
      printerBrand: 'Brother DCP-T420W',
      problemSolved: 'Error system + tidak menyala',
      date: '2025-01-03',
      beforeImage: 'https://ekakom.com/wp-content/uploads/2018/06/Jasa-service-printer-Buaran-3.jpg',
      afterImage: 'https://ekakom.com/wp-content/uploads/2018/06/Jasa-Service-Printer-Jatinegara-1.jpg'
    },
    {
      id: 5,
      name: 'Budi Santoso',
      location: 'Paal Merah',
      rating: 4,
      comment: 'Service untuk Samsung laser printer saya sangat memuaskan. Masalah kertas sering jam sudah teratasi. Teknisinya juga memberikan tips cara membersihkan printer yang benar. Mantap!',
      printerBrand: 'Samsung M2070',
      problemSolved: 'Paper jam + roller kotor',
      date: '2025-01-01',
      beforeImage: 'https://siopen.hulusungaiselatankab.go.id/storage/merchant/products/2024/10/24/bb6bfb7cf92f69268958b99e97965cc9.jpg',
      afterImage: 'https://parto.id/asset/foto_produk/SERVICE_PRINTER_EPSON_jpg_171144276293.jpg'
    },
    {
      id: 6,
      name: 'Lisa Permata',
      location: 'Jelutung',
      rating: 5,
      comment: 'Fuji Xerox printer kantor saya bermasalah tidak bisa scan dan copy. Teknisi Barokah Printer datang langsung ke kantor dan memperbaikinya dengan cepat. Sekarang printer sudah normal kembali. Excellent service!',
      printerBrand: 'Fuji Xerox DocuPrint M115w',
      problemSolved: 'Scanner error + tidak bisa copy',
      date: '2025-01-28',
      beforeImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROsB2ZcHZB02-ON_HRI-Z_hrRWbq7yBFzgFN75vgtdo3PcMn4G3oWCbNwW0EMREqUDYgg&usqp=CAU',
      afterImage: 'https://solusiprinter1.wordpress.com/wp-content/uploads/2016/03/service-printer-panggilan.jpg'
    }
  ];

  const stats = {
    totalCustomers: 1250,
    averageRating: 4.9,
    completedServices: 1180,
    satisfactionRate: 98
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50 animated-bg relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 pointer-events-none"
        style={{
          backgroundImage: 'url(https://i.pinimg.com/736x/ee/62/b3/ee62b341b7cfee91d15b05216029e048.jpg)'
        }}
      ></div>
      {/* Animated Cubes */}
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>
      
      {/* Floating Particles */}
      <div className="floating-particles">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Testimoni Pelanggan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kepuasan pelanggan adalah prioritas utama kami. Lihat apa kata mereka tentang 
            layanan service printer Barokah Printer.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 mobile-fade-left">
          {[
            { value: `${stats.totalCustomers.toLocaleString()}+`, label: 'Pelanggan Puas', color: 'text-blue-600' },
            { value: `${stats.averageRating}/5.0`, label: 'Rating Rata-rata', color: 'text-yellow-500' },
            { value: `${stats.completedServices.toLocaleString()}+`, label: 'Service Selesai', color: 'text-green-600' },
            { value: `${stats.satisfactionRate}%`, label: 'Tingkat Kepuasan', color: 'text-purple-600' }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center card-hover" data-aos="zoom-in" data-aos-delay={index * 200}>
              <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col card-hover-glow" data-aos="fade-up" data-aos-delay={index * 200}>
              {/* Before/After Images */}
              <div className="grid grid-cols-2 h-48 flex-shrink-0">
                <div className="relative">
                  <img
                    src={testimonial.beforeImage}
                    alt="Before service"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Sebelum
                  </div>
                </div>
                <div className="relative">
                  <img
                    src={testimonial.afterImage}
                    alt="After service"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Sesudah
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                  <div className="flex items-center space-x-1 ml-4 flex-shrink-0">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>

                {/* Printer Info */}
                <div className="bg-blue-50 rounded-lg p-3 mb-4 flex-shrink-0 card-hover-subtle">
                  <div className="text-sm font-medium text-blue-900 mb-1">
                    {testimonial.printerBrand}
                  </div>
                  <div className="text-sm text-blue-700">
                    Masalah: {testimonial.problemSolved}
                  </div>
                </div>

                {/* Comment */}
                <div className="relative mb-4 flex-1">
                  <Quote className="absolute top-0 left-0 h-6 w-6 text-gray-300 transform -translate-x-1 -translate-y-1 flex-shrink-0" />
                  <p className="text-gray-700 italic pl-5 text-sm leading-relaxed">
                    "{testimonial.comment}"
                  </p>
                </div>

                {/* Date */}
                <div className="flex items-center text-sm text-gray-500 mt-auto pt-2 border-t border-gray-100">
                  <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {new Date(testimonial.date).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white card-hover-glow mobile-fade-left" data-aos="fade-up" data-aos-delay="400">
          <h2 className="text-3xl font-bold mb-6">
            Bergabunglah dengan 1000+ Pelanggan Puas!
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Dapatkan service printer terbaik dengan garansi resmi dan teknisi berpengalaman
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="600">
            <button
              onClick={() => onNavigate('booking')}
              className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors card-hover-bounce"
            >
              Booking Service Sekarang
            </button>
            <button
              onClick={() => window.open('https://wa.me/6285368148449', '_blank')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors card-hover-bounce"
            >
              Konsultasi Gratis
            </button>
          </div>
        </div>

        {/* Reviews Summary */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 card-hover-glow" data-aos="fade-up" data-aos-delay="600">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Rating & Review Summary
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center" data-aos="fade-right" data-aos-delay="800">
              <div className="text-6xl font-bold text-yellow-500 mb-2">
                {stats.averageRating}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(5)}
              </div>  
              <div className="text-gray-600">
                Berdasarkan {stats.totalCustomers}+ ulasan pelanggan
              </div>
            </div>
            
            <div className="space-y-3" data-aos="fade-left" data-aos-delay="1000">
              {[5, 4, 3, 2, 1].map((stars, index) => {
                const percentage = stars === 5 ? 85 : stars === 4 ? 12 : stars === 3 ? 2 : stars === 2 ? 1 : 0;
                return (
                  <div key={stars} className="flex items-center space-x-3 card-hover-subtle p-2 rounded-lg" data-aos="fade-up" data-aos-delay={1200 + index * 100}>
                    <div className="flex items-center space-x-1 w-20">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{stars}</span>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;