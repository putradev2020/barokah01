import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  Wrench, 
  TrendingUp, 
  Search, 
  Filter, 
  Download,
  Eye,
  UserPlus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Printer,
  Settings,
  Plus,
  X,
  Save
} from 'lucide-react';
import { getAllBookings } from '../utils/bookingSupabase';
import { 
  updateBookingStatus, 
  assignTechnician, 
  updateActualCost,
  deleteBooking,
  updateBookingDetails,
  getBookingForEdit,
  fetchTechnicians 
} from '../utils/supabaseData';
import { supabase } from '../utils/supabase';
import Swal from 'sweetalert2';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onLogout }) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});

  // Load data
  useEffect(() => {
    loadData();
    loadTechnicians();
    
    // Setup realtime subscription for bookings
    const bookingsChannel = supabase
      .channel('admin-bookings-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'service_bookings'
      }, (payload) => {
        console.log('Booking change detected:', payload);
        loadData(); // Reload data when changes occur
      })
      .subscribe();

    // Setup realtime subscription for customers
    const customersChannel = supabase
      .channel('admin-customers-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'customers'
      }, () => {
        loadData(); // Reload data when customer changes occur
      })
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(customersChannel);
    };
  }, []);

  const loadData = async () => {
    try {
      const bookingsData = await getAllBookings();
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error loading bookings:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal memuat data booking'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadTechnicians = async () => {
    try {
      const techniciansData = await fetchTechnicians();
      setTechnicians(techniciansData);
    } catch (error) {
      console.error('Error loading technicians:', error);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Status booking berhasil diperbarui',
        timer: 2000,
        showConfirmButton: false
      });
      
      // Data will be automatically updated via realtime subscription
    } catch (error) {
      console.error('Error updating status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal memperbarui status booking'
      });
    }
  };

  const handleAssignTechnician = async (bookingId: string, technicianId: string) => {
    try {
      await assignTechnician(bookingId, technicianId);
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Teknisi berhasil ditugaskan',
        timer: 2000,
        showConfirmButton: false
      });
      
      // Data will be automatically updated via realtime subscription
    } catch (error) {
      console.error('Error assigning technician:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal menugaskan teknisi'
      });
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    const result = await Swal.fire({
      title: 'Hapus Booking?',
      text: 'Data booking akan dihapus permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await deleteBooking(bookingId);
        
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Booking berhasil dihapus',
          timer: 2000,
          showConfirmButton: false
        });
        
        // Data will be automatically updated via realtime subscription
      } catch (error) {
        console.error('Error deleting booking:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal menghapus booking'
        });
      }
    }
  };

  const handleViewDetail = (booking: any) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleEditBooking = async (booking: any) => {
    try {
      const bookingData = await getBookingForEdit(booking.id);
      setEditFormData({
        id: bookingData.id,
        customer_name: bookingData.customer.name,
        customer_phone: bookingData.customer.phone,
        customer_email: bookingData.customer.email || '',
        customer_address: bookingData.customer.address || '',
        appointment_date: bookingData.appointment_date,
        appointment_time: bookingData.appointment_time,
        problem_description: bookingData.problem_description || '',
        notes: bookingData.notes || '',
        estimated_cost: bookingData.estimated_cost || '',
        actual_cost: bookingData.actual_cost || ''
      });
      setShowEditModal(true);
    } catch (error) {
      console.error('Error loading booking for edit:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal memuat data booking untuk edit'
      });
    }
  };

  const handleSaveEdit = async () => {
    try {
      // Update customer data
      await supabase
        .from('customers')
        .update({
          name: editFormData.customer_name,
          phone: editFormData.customer_phone,
          email: editFormData.customer_email,
          address: editFormData.customer_address
        })
        .eq('id', selectedBooking.customer.id);

      // Update booking data
      await updateBookingDetails(editFormData.id, {
        appointment_date: editFormData.appointment_date,
        appointment_time: editFormData.appointment_time,
        problem_description: editFormData.problem_description,
        notes: editFormData.notes,
        estimated_cost: editFormData.estimated_cost,
        actual_cost: editFormData.actual_cost
      });

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data booking berhasil diperbarui',
        timer: 2000,
        showConfirmButton: false
      });

      setShowEditModal(false);
      // Data will be automatically updated via realtime subscription
    } catch (error) {
      console.error('Error updating booking:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal memperbarui data booking'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu';
      case 'confirmed':
        return 'Dikonfirmasi';
      case 'in-progress':
        return 'Dalam Proses';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    completedBookings: bookings.filter(b => b.status === 'completed').length,
    inProgressBookings: bookings.filter(b => b.status === 'in-progress').length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Kelola booking dan data service printer</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('home')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Kembali ke Website
              </button>
              <button
                onClick={onLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Booking</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Menunggu</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Wrench className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Dalam Proses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgressBookings}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Selesai</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari booking..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="confirmed">Dikonfirmasi</option>
                <option value="in-progress">Dalam Proses</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Daftar Booking</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID & Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Printer & Masalah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jadwal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teknisi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-blue-600">#{booking.id}</div>
                        <div className="text-sm font-medium text-gray-900">{booking.customer.name}</div>
                        <div className="text-sm text-gray-500">{booking.customer.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.printer.brand} {booking.printer.model}
                        </div>
                        <div className="text-sm text-gray-500">{booking.problem.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.service.date}</div>
                      <div className="text-sm text-gray-500">{booking.service.time} WIB</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(booking.status)}`}
                      >
                        <option value="pending">Menunggu</option>
                        <option value="confirmed">Dikonfirmasi</option>
                        <option value="in-progress">Dalam Proses</option>
                        <option value="completed">Selesai</option>
                        <option value="cancelled">Dibatalkan</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={booking.technician_id || ''}
                        onChange={(e) => handleAssignTechnician(booking.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Pilih Teknisi</option>
                        {technicians.map((tech) => (
                          <option key={tech.id} value={tech.id}>
                            {tech.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetail(booking)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Lihat Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditBooking(booking)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Detail Booking #{selectedBooking.id}</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Customer</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Nama</label>
                      <p className="text-gray-900">{selectedBooking.customer.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Telepon</label>
                      <p className="text-gray-900">{selectedBooking.customer.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{selectedBooking.customer.email || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-600">Alamat</label>
                      <p className="text-gray-900">{selectedBooking.customer.address || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Service Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Service</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Printer</label>
                      <p className="text-gray-900">{selectedBooking.printer.brand} {selectedBooking.printer.model}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Kategori Masalah</label>
                      <p className="text-gray-900">{selectedBooking.problem.category}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-600">Deskripsi Masalah</label>
                      <p className="text-gray-900">{selectedBooking.problem.description}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Tanggal</label>
                      <p className="text-gray-900">{selectedBooking.service.date}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Waktu</label>
                      <p className="text-gray-900">{selectedBooking.service.time} WIB</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedBooking.status)}`}>
                        {getStatusLabel(selectedBooking.status)}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Teknisi</label>
                      <p className="text-gray-900">{selectedBooking.technician}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Estimasi Biaya</label>
                      <p className="text-gray-900">{selectedBooking.estimatedCost}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Biaya Aktual</label>
                      <p className="text-gray-900">{selectedBooking.actualCost || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h3>
                  <div className="space-y-3">
                    {selectedBooking.timeline.map((item: any, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-4 h-4 rounded-full mt-1 ${item.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          {item.timestamp && (
                            <p className="text-xs text-gray-500">
                              {new Date(item.timestamp).toLocaleString('id-ID')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Booking #{editFormData.id}</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Customer</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                      <input
                        type="text"
                        value={editFormData.customer_name || ''}
                        onChange={(e) => setEditFormData({...editFormData, customer_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                      <input
                        type="text"
                        value={editFormData.customer_phone || ''}
                        onChange={(e) => setEditFormData({...editFormData, customer_phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={editFormData.customer_email || ''}
                        onChange={(e) => setEditFormData({...editFormData, customer_email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                      <textarea
                        value={editFormData.customer_address || ''}
                        onChange={(e) => setEditFormData({...editFormData, customer_address: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Service</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                      <input
                        type="date"
                        value={editFormData.appointment_date || ''}
                        onChange={(e) => setEditFormData({...editFormData, appointment_date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
                      <input
                        type="time"
                        value={editFormData.appointment_time || ''}
                        onChange={(e) => setEditFormData({...editFormData, appointment_time: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Masalah</label>
                      <textarea
                        value={editFormData.problem_description || ''}
                        onChange={(e) => setEditFormData({...editFormData, problem_description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estimasi Biaya</label>
                      <input
                        type="text"
                        value={editFormData.estimated_cost || ''}
                        onChange={(e) => setEditFormData({...editFormData, estimated_cost: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Biaya Aktual</label>
                      <input
                        type="text"
                        value={editFormData.actual_cost || ''}
                        onChange={(e) => setEditFormData({...editFormData, actual_cost: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                      <textarea
                        value={editFormData.notes || ''}
                        onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Simpan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;