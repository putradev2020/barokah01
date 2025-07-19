import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { 
  Search, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Truck, 
  Wrench, 
  Phone, 
  MapPin, 
  Calendar,
  User,
  Printer,
  FileText,
  Star,
  Download,
  Eye
} from 'lucide-react';
import { getBookings, getBookingById } from '../utils/bookingStorage';
import { getBookingById as getBookingByIdSupabase, getAllBookings } from '../utils/bookingSupabase';
import { supabase } from '../utils/supabase';

interface CheckStatusProps {
  onNavigate: (page: string) => void;
}

const CheckStatus: React.FC<CheckStatusProps> = ({ onNavigate }) => {
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  // Load all bookings from Supabase with realtime subscription
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const bookings = await getAllBookings();
        setAllBookings(bookings);
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    loadBookings();

    // Setup realtime subscription for booking updates
    const bookingsChannel = supabase
      .channel('bookings-status-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'service_bookings'
      }, async (payload) => {
        console.log('Booking status change detected:', payload);
        
        // Reload all bookings to get updated data
        const updatedBookings = await getAllBookings();
        setAllBookings(updatedBookings);
        
        // If we have a search result and it matches the updated booking, refresh it
        if (searchResult && payload.new && payload.new.id === searchResult.id) {
          const updatedBooking = updatedBookings.find(b => b.id === searchResult.id);
          if (updatedBooking) {
            setSearchResult(updatedBooking);
          }
        }
      })
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(bookingsChannel);
    };
  }, [searchResult]);

  const handleSearch = async () => {
    if (!searchId.trim()) {
      Swal.fire({
        title: 'Peringatan!',
        text: 'Masukkan ID Booking terlebih dahulu',
        icon: 'warning',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    setIsSearching(true);
    
    try {
      const result = await getBookingByIdSupabase(searchId);
      setSearchResult(result);
      
      if (!result) {
        Swal.fire({
          title: 'Tidak Ditemukan!',
          text: 'ID Booking tidak ditemukan. Pastikan ID yang Anda masukkan benar.',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    } catch (error) {
      console.error('Error searching booking:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Terjadi kesalahan saat mencari booking. Silakan coba lagi.',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'servicing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5" />;
      case 'in-progress':
        return <Truck className="h-5 w-5" />;
      case 'servicing':
        return <Wrench className="h-5 w-5" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu Konfirmasi';
      case 'confirmed':
        return 'Dikonfirmasi';
      case 'in-progress':
        return 'Dalam Proses';
      case 'servicing':
        return 'Sedang Diperbaiki';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <div className="text-center mb-8 sm:mb-12" data-aos="fade-up">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            Cek Status Barang
          </h1>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Pantau status perbaikan printer Anda secara real-time. Masukkan ID Booking 
            untuk melihat progress dan detail service printer Anda.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 card-hover-glow mobile-fade-left" data-aos="fade-up" data-aos-delay="200">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
              Masukkan ID Booking Anda
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4" data-aos="fade-up" data-aos-delay="400">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value.toUpperCase())}
                  placeholder="Contoh: BRK001"
                  className="w-full px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base lg:text-lg font-mono card-hover-subtle"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-blue-600 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 card-hover-scale text-sm sm:text-base"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{isSearching ? 'Mencari...' : 'Cek Status'}</span>
              </button>
            </div>

            <div className="mt-4 sm:mt-6 text-center" data-aos="fade-up" data-aos-delay="600">
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base px-2">
                ID Booking dapat ditemukan di email konfirmasi atau SMS yang kami kirimkan setelah booking.
              </p>
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm text-gray-500">Contoh ID:</span>
                {allBookings.slice(0, 5).map((booking) => (
                  <button
                    key={booking.id}
                    onClick={() => setSearchId(booking.id)}
                    className="text-xs sm:text-sm bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full hover:bg-gray-200 transition-colors card-hover-scale"
                  >
                    {booking.id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search Result */}
        {searchResult && (
          <div className="space-y-8">
            {/* Status Overview */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover-glow" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 lg:p-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div data-aos="fade-right" data-aos-delay="400">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">ID: {searchResult.id}</h2>
                    <p className="text-blue-100 text-sm sm:text-base">Status Booking Anda</p>
                  </div>
                  <div className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full border-2 ${getStatusColor(searchResult.status)} bg-white`} data-aos="fade-left" data-aos-delay="600">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      {getStatusIcon(searchResult.status)}
                      <span className="font-semibold text-sm sm:text-base">{getStatusLabel(searchResult.status)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {[
                    { icon: User, label: 'Customer', value: searchResult.customer.name },
                    { icon: Printer, label: 'Printer', value: `${searchResult.printer.brand} ${searchResult.printer.model}` },
                    { icon: Calendar, label: 'Tanggal Service', value: formatDate(searchResult.service.date) },
                    { icon: Wrench, label: 'Teknisi', value: searchResult.technician },
                    { icon: Package, label: 'Jenis Service', value: searchResult.service.type },
                    { icon: FileText, label: 'Estimasi Biaya', value: searchResult.estimatedCost }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 sm:space-x-3 card-hover-subtle p-2 sm:p-3 rounded-lg" data-aos="fade-up" data-aos-delay={200 + index * 100}>
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-600">{item.label}</p>
                        <p className="font-semibold text-sm sm:text-base truncate">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 card-hover-glow mobile-fade-left" data-aos="fade-up" data-aos-delay="400">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">Timeline Progress</h3>
              
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                {searchResult.timeline.map((step: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3 sm:space-x-4 card-hover-subtle p-3 sm:p-4 rounded-lg" data-aos="fade-right" data-aos-delay={index * 200}>
                    <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                        <h4 className={`text-sm sm:text-base lg:text-lg font-semibold ${
                          step.completed ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </h4>
                        {step.timestamp && (
                          <span className="text-xs sm:text-sm text-gray-500">
                            {formatDateTime(step.timestamp)}
                          </span>
                        )}
                      </div>
                      <p className={`mt-1 text-sm sm:text-base ${
                        step.completed ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail Information */}
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Customer & Service Details */}
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 card-hover-glow" data-aos="fade-right" data-aos-delay="200">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Detail Customer & Service</h3>
                
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { label: 'Nama Lengkap', value: searchResult.customer.name },
                    { label: 'Nomor HP', value: searchResult.customer.phone },
                    { label: 'Email', value: searchResult.customer.email },
                    { label: 'Alamat', value: searchResult.customer.address },
                    { label: 'Kategori Masalah', value: searchResult.problem.category },
                    { label: 'Deskripsi Masalah', value: searchResult.problem.description },
                    ...(searchResult.notes ? [{ label: 'Catatan Teknisi', value: searchResult.notes }] : [])
                  ].map((item, index) => (
                    <div key={index} className="card-hover-subtle p-2 sm:p-3 rounded-lg" data-aos="fade-up" data-aos-delay={index * 100}>
                      <label className="text-xs sm:text-sm font-medium text-gray-600">{item.label}</label>
                      <p className="text-gray-900 text-sm sm:text-base">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost & Rating */}
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Cost Information */}
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 card-hover-glow" data-aos="fade-left" data-aos-delay="400">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Informasi Biaya</h3>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center card-hover-subtle p-2 sm:p-3 rounded-lg">
                      <span className="text-gray-600 text-sm sm:text-base">Estimasi Biaya:</span>
                      <span className="font-semibold text-blue-600 text-sm sm:text-base">{searchResult.estimatedCost}</span>
                    </div>
                    <div className="flex justify-between items-center card-hover-subtle p-2 sm:p-3 rounded-lg">
                      <span className="text-gray-600 text-sm sm:text-base">Biaya Aktual:</span>
                      <span className="font-semibold text-green-600 text-sm sm:text-base">
                        {searchResult.actualCost || 'Belum ditentukan'}
                      </span>
                    </div>
                    <div className="border-t pt-3 sm:pt-4">
                      <div className="flex justify-between items-center card-hover-subtle p-2 sm:p-3 rounded-lg">
                        <span className="text-base sm:text-lg font-semibold text-gray-900">Total Biaya:</span>
                        <span className="text-lg sm:text-xl font-bold text-green-600">
                          {searchResult.actualCost || searchResult.estimatedCost}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating & Review */}
                {searchResult.status === 'completed' && searchResult.rating && (
                  <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 card-hover-glow" data-aos="fade-left" data-aos-delay="600">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Rating & Review</h3>
                    
                    <div className="text-center mb-4 sm:mb-6">
                      <div className="flex justify-center mb-2">
                        {Array.from({ length: 5 }, (_, index) => (
                          <Star
                            key={index}
                            className={`h-5 w-5 sm:h-6 sm:w-6 ${
                              index < searchResult.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{searchResult.rating}/5</p>
                    </div>
                    
                    {searchResult.review && (
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 card-hover-subtle">
                        <p className="text-gray-700 italic text-sm sm:text-base">"{searchResult.review}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 card-hover-glow mobile-fade-left" data-aos="fade-up" data-aos-delay="800">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Aksi</h3>
              
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <button
                  onClick={() => window.open(`https://wa.me/6285368148449?text=Halo, saya ingin menanyakan status booking ${searchResult.id}`, '_blank')}
                  className="bg-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 card-hover-scale text-sm sm:text-base"
                >
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Hubungi via WhatsApp</span>
                  <span className="sm:hidden">WhatsApp</span>
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 card-hover-scale text-sm sm:text-base"
                >
                  <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Print Detail</span>
                  <span className="sm:hidden">Print</span>
                </button>
                
                <button
                  onClick={() => onNavigate('booking')}
                  className="bg-gray-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 card-hover-scale text-sm sm:text-base"
                >
                  <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Booking Lagi</span>
                  <span className="sm:hidden">Booking</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* All Orders History */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg card-hover-glow mobile-fade-left" data-aos="fade-up" data-aos-delay="400">
          <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Histori Semua Pemesanan</h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Daftar semua booking service printer yang telah dilakukan pelanggan
            </p>
          </div>
          
          {isLoadingBookings ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat data booking...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['ID & Customer', 'Printer & Masalah', 'Service', 'Tanggal', 'Status', 'Aksi'].map((header, index) => (
                      <th key={index} className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allBookings.map((booking, index) => (
                    <tr key={booking.id} className="hover:bg-gray-50 card-hover-subtle" data-aos="fade-up" data-aos-delay={index * 100}>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-blue-600">
                            #{booking.id}
                          </div>
                          <div className="text-xs sm:text-sm font-medium text-gray-900">
                            {booking.customer.name}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">{booking.customer.phone}</div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-gray-900">
                            {booking.printer.brand} {booking.printer.model}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">{booking.problem.category}</div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm text-gray-900">{booking.service.type}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{booking.technician}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm text-gray-900">{formatDate(booking.service.date)}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{booking.service.time} WIB</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1">{getStatusLabel(booking.status)}</span>
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                        <button
                          onClick={() => setSearchId(booking.id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1 card-hover-scale"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Detail</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 lg:p-12 text-center text-white card-hover-glow" data-aos="fade-up" data-aos-delay="600">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Butuh Bantuan?</h2>
          <p className="text-base sm:text-xl text-blue-100 mb-6 sm:mb-8">
            Tim customer service kami siap membantu Anda 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => window.open('https://wa.me/6285368148449', '_blank')}
              className="bg-green-500 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 card-hover-scale text-sm sm:text-base"
            >
              <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">WhatsApp: +62853-6814-8449</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="bg-white text-blue-600 px-4 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 card-hover-scale text-sm sm:text-base"
            >
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Kunjungi Toko</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckStatus;