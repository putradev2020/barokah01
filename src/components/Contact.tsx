import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';

interface ContactProps {
  onNavigate: (page: string) => void;
}

const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    Swal.fire({
      title: 'Berhasil!',
      text: 'Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
    setIsSubmitting(false);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Telepon',
      details: ['+62853-6814-8449'],
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['barokahprint22@gmail.com'],
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: MapPin,
      title: 'Alamat',
      details: ['Jl. Depati Parbo No.rt 17', 'Pematang Sulur, Kec. Telanaipura', 'Kota Jambi, Jambi 36361'],
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      details: ['Senin-Sabtu: 08:00-17:00', 'Minggu: 09:00-16:00'],
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  const services = [
    'Service & Perbaikan Printer',
    'Refill Tinta Original',
    'Reset Printer Error',
    'Instalasi Driver & Software',
    'Konsultasi Gratis'
  ];

  const serviceAreas = [
    'Kota Jambi', 'Muaro Jambi', 'Batanghari', 'Tanjab Timur', 'Tanjab Barat',
    'Kerinci', 'Merangin', 'Sarolangun', 'Bungo', 'Tebo'
  ];

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
        <div className="text-center mb-8 sm:mb-12 lg:mb-16" data-aos="fade-up">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Hubungi Kami
          </h1>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Ada pertanyaan tentang service printer? Tim customer service kami siap membantu Anda.
            Hubungi kami melalui berbagai channel yang tersedia.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16">
          {contactInfo.map((info, index) => {
            const getClickHandler = () => {
              switch (info.title) {
                 case 'Telepon':
                   return () => window.open('https://wa.me/6285368148449', '_blank');
                 case 'Email':
                   return () => window.open('mailto:barokahprint22@gmail.com');
                 case 'Alamat':
                   return () => window.open('https://maps.google.com/?q=Jl.+Depati+Parbo+No.rt+17,+Pematang+Sulur,+Kec.+Telanaipura,+Kota+Jambi,+Jambi+36361', '_blank');
                 default:
                   return undefined;
               }
            };
            
            const clickHandler = getClickHandler();
            const isClickable = clickHandler !== undefined;
            
            if (isClickable) {
              return (
                <button 
                  key={index} 
                  onClick={clickHandler}
                  className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center card-hover hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105" 
                  data-aos="fade-up" 
                  data-aos-delay={index * 200}
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 ${info.color} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                    <info.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-xs sm:text-sm text-gray-600">{detail}</p>
                    ))}
                  </div>
                </button>
              );
            } else {
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center card-hover" data-aos="fade-up" data-aos-delay={index * 200}>
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 ${info.color} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                    <info.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-xs sm:text-sm text-gray-600">{detail}</p>
                    ))}
                  </div>
                </div>
              );
            }
          })}
        </div>

        {/* Contact Form & Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 card-hover-glow" data-aos="fade-right" data-aos-delay="200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Kirim Pesan
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div data-aos="fade-up" data-aos-delay="300">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent card-hover-subtle text-sm sm:text-base"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div data-aos="fade-up" data-aos-delay="400">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor HP *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent card-hover-subtle text-sm sm:text-base"
                    placeholder="+62853-6814-8449"
                  />
                </div>
              </div>

              <div data-aos="fade-up" data-aos-delay="500">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent card-hover-subtle text-sm sm:text-base"
                  placeholder="email@example.com"
                />
              </div>

              <div data-aos="fade-up" data-aos-delay="600">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subjek *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent card-hover-subtle text-sm sm:text-base"
                >
                  <option value="">Pilih Subjek</option>
                  <option value="service-inquiry">Pertanyaan Service</option>
                  <option value="booking-help">Bantuan Booking</option>
                  <option value="complaint">Keluhan</option>
                  <option value="suggestion">Saran</option>
                  <option value="partnership">Kerjasama</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div data-aos="fade-up" data-aos-delay="700">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pesan *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent card-hover-subtle text-sm sm:text-base"
                  placeholder="Tulis pesan Anda di sini..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 card-hover-scale text-sm sm:text-base"
                data-aos="fade-up"
                data-aos-delay="800"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}</span>
              </button>
            </form>
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-8">
            {/* Quick Contact */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-4 sm:p-6 lg:p-8 text-white card-hover-glow mobile-fade-left" data-aos="fade-left" data-aos-delay="300">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Kontak Cepat</h3>
              <p className="text-green-100 mb-4 sm:mb-6 text-sm sm:text-base">
                Butuh bantuan segera? Hubungi langsung tim support kami
              </p>
              <div className="space-y-3 sm:space-y-4">
                <button
                  onClick={() => window.open('https://wa.me/6285368148449', '_blank')}
                  className="w-full bg-white text-green-600 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 font-medium card-hover-scale text-sm sm:text-base"
                >
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">WhatsApp: +62853-6814-8449</span>
                  <span className="sm:hidden">WhatsApp</span>
                </button>
                <button
                  onClick={() => window.open('https://wa.me/6285368148449', '_blank')}
                  className="w-full border-2 border-white text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-white hover:text-green-600 transition-colors flex items-center justify-center space-x-2 font-medium card-hover-scale text-sm sm:text-base"
                >
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Telepon: +62853-6814-8449</span>
                  <span className="sm:hidden">Telepon</span>
                </button>
              </div>
            </div>

            {/* Service Areas */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 card-hover-glow" data-aos="fade-left" data-aos-delay="500">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Area Layanan</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                Kami melayani service printer di seluruh Provinsi Jambi:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {serviceAreas.map((area, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 text-blue-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-center card-hover-scale"
                    data-aos="zoom-in"
                    data-aos-delay={500 + index * 50}
                  >
                    {area}
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 card-hover-glow mobile-fade-left" data-aos="fade-left" data-aos-delay="700">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Layanan Kami</h3>
              <div className="space-y-2 sm:space-y-3">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center space-x-2 sm:space-x-3 card-hover-subtle p-2 rounded-lg" data-aos="fade-up" data-aos-delay={700 + index * 100}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm sm:text-base">{service}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onNavigate('services')}
                className="mt-4 sm:mt-6 w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium card-hover-scale text-sm sm:text-base"
              >
                Lihat Semua Layanan
              </button>
            </div>
          </div>
        </div>

        {/* Map & Address */}
        <div className="mt-8 sm:mt-12 lg:mt-16 bg-white rounded-2xl shadow-lg overflow-hidden card-hover-glow mobile-fade-left" data-aos="fade-up" data-aos-delay="400">
          <div className="p-4 sm:p-6 lg:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Lokasi Toko</h3>
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div data-aos="fade-right" data-aos-delay="600">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Barokah Printer Service Center
                </h4>
                <div className="space-y-2 sm:space-y-3 text-gray-600">
                  <button 
                    onClick={() => window.open('https://maps.google.com/?q=Jl.+Depati+Parbo+No.rt+17,+Pematang+Sulur,+Kec.+Telanaipura,+Kota+Jambi,+Jambi+36361', '_blank')}
                    className="flex items-start space-x-2 sm:space-x-3 card-hover-subtle p-2 sm:p-3 rounded-lg w-full text-left hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm sm:text-base">Jl. Depati Parbo No.rt 17</p>
                      <p className="text-sm sm:text-base">Pematang Sulur, Kec. Telanaipura</p>
                      <p className="text-sm sm:text-base">Kota Jambi, Jambi 36361</p>
                      <p className="text-sm sm:text-base">Indonesia</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => window.open('https://wa.me/6285368148449', '_blank')}
                    className="flex items-center space-x-2 sm:space-x-3 card-hover-subtle p-2 sm:p-3 rounded-lg w-full text-left hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                    <p className="text-sm sm:text-base">+62853-6814-8449</p>
                  </button>
                  <button 
                    onClick={() => window.open('mailto:barokahprint22@gmail.com')}
                    className="flex items-center space-x-2 sm:space-x-3 card-hover-subtle p-2 sm:p-3 rounded-lg w-full text-left hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                    <p className="text-sm sm:text-base">barokahprint22@gmail.com</p>
                  </button>
                  <div className="flex items-start space-x-2 sm:space-x-3 card-hover-subtle p-2 sm:p-3 rounded-lg bg-gray-50">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">Jam Operasional</p>
                      <p className="text-gray-600 text-sm sm:text-base">Senin - Sabtu: 08:00 - 17:00</p>
                      <p className="text-gray-600 text-sm sm:text-base">Minggu: 08:00 - 16:00</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg h-64 sm:h-72 lg:h-80 xl:h-96 overflow-hidden card-hover-subtle" data-aos="fade-left" data-aos-delay="800">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.6234567890123!2d103.5592!3d-1.5994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMzUnNTcuOCJTIDEwM8KwMzMnMzMuMSJF!5e0!3m2!1sid!2sid!4v1234567890123!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Barokah Printer Service Center"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 sm:mt-12 lg:mt-16 bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 card-hover-glow mobile-fade-left" data-aos="fade-up" data-aos-delay="600">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            Pertanyaan yang Sering Diajukan
          </h3>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <div className="space-y-4 sm:space-y-6">
              {[
                {
                  question: 'Berapa lama waktu service printer?',
                  answer: 'Waktu service bervariasi tergantung masalah, umumnya 1-3 jam untuk masalah ringan.'
                },
                {
                  question: 'Apakah ada garansi service?',
                  answer: 'Ya, semua service dilengkapi garansi 30 hari untuk pekerjaan yang sama.'
                },
                {
                  question: 'Apakah bisa service di lokasi?',
                  answer: 'Ya, kami menyediakan layanan teknisi datang ke lokasi Anda.'
                }
              ].map((faq, index) => (
                <div key={index} className="card-hover-subtle p-3 sm:p-4 rounded-lg" data-aos="fade-up" data-aos-delay={800 + index * 200}>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                    {faq.question}
                  </h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-4 sm:space-y-6">
              {[
                {
                  question: 'Printer merk apa saja yang bisa di-service?',
                  answer: 'Semua merk: Canon, Epson, HP, Brother, Samsung, Fuji Xerox, dll.'
                },
                {
                  question: 'Bagaimana cara booking service?',
                  answer: 'Bisa melalui website, WhatsApp, atau telepon langsung ke customer service.'
                },
                {
                  question: 'Apakah tersedia spare part original?',
                  answer: 'Ya, kami menyediakan spare part original dan compatible berkualitas.'
                }
              ].map((faq, index) => (
                <div key={index} className="card-hover-subtle p-3 sm:p-4 rounded-lg" data-aos="fade-up" data-aos-delay={1000 + index * 200}>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                    {faq.question}
                  </h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;