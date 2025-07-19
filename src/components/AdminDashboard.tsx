import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  Calendar, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  Wrench,
  Star,
  Phone,
  Mail,
  MapPin,
  Printer,
  Settings,
  Image,
  Upload,
  Download,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { 
  fetchPrinterBrands, 
  fetchProblemCategories,
  addPrinterBrand,
  addPrinterModel,
  updatePrinterBrand,
  updatePrinterModel,
  deletePrinterBrand,
  deletePrinterModel,
  addProblemCategory,
  addProblem,
  updateProblemCategory,
  updateProblem,
  deleteProblemCategory,
  deleteProblem,
  fetchGalleryImages,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  fetchTechnicians,
  addTechnician,
  updateTechnician,
  deleteTechnician
} from '../utils/supabaseData';
import { getAllBookings, updateBookingStatus, assignTechnician, updateActualCost } from '../utils/bookingSupabase';
import { supabase } from '../utils/supabase';
import Swal from 'sweetalert2';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<any[]>([]);
  const [printerBrands, setPrinterBrands] = useState<any[]>([]);
  const [problemCategories, setProblemCategories] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Edit states
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [editingModel, setEditingModel] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingProblem, setEditingProblem] = useState<any>(null);
  const [editingTechnician, setEditingTechnician] = useState<any>(null);
  const [editingGallery, setEditingGallery] = useState<any>(null);

  // Form states
  const [newBrandName, setNewBrandName] = useState('');
  const [newModelData, setNewModelData] = useState({ brandId: '', name: '', type: 'inkjet' });
  const [newCategoryData, setNewCategoryData] = useState({ name: '', icon: 'Printer' });
  const [newProblemData, setNewProblemData] = useState({
    categoryId: '',
    name: '',
    description: '',
    severity: 'medium',
    estimatedTime: '',
    estimatedCost: ''
  });
  const [newTechnicianData, setNewTechnicianData] = useState({
    name: '',
    phone: '',
    email: '',
    specialization: [] as string[],
    experience: 0,
    rating: 5
  });
  const [newGalleryData, setNewGalleryData] = useState({
    title: '',
    alt_text: '',
    image_url: '',
    category: 'service',
    sort_order: 0
  });

  useEffect(() => {
    loadData();
    
    // Setup realtime subscriptions
    const bookingsChannel = supabase
      .channel('admin-bookings-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'service_bookings'
      }, () => {
        loadBookings();
      })
      .subscribe();

    const brandsChannel = supabase
      .channel('admin-brands-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'printer_brands'
      }, () => {
        loadPrinterBrands();
      })
      .subscribe();

    const modelsChannel = supabase
      .channel('admin-models-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'printer_models'
      }, () => {
        loadPrinterBrands();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(brandsChannel);
      supabase.removeChannel(modelsChannel);
    };
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadBookings(),
        loadPrinterBrands(),
        loadProblemCategories(),
        loadGalleryImages(),
        loadTechnicians()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const loadPrinterBrands = async () => {
    try {
      const data = await fetchPrinterBrands();
      setPrinterBrands(data);
    } catch (error) {
      console.error('Error loading printer brands:', error);
    }
  };

  const loadProblemCategories = async () => {
    try {
      const data = await fetchProblemCategories();
      setProblemCategories(data);
    } catch (error) {
      console.error('Error loading problem categories:', error);
    }
  };

  const loadGalleryImages = async () => {
    try {
      const data = await fetchGalleryImages();
      setGalleryImages(data);
    } catch (error) {
      console.error('Error loading gallery images:', error);
    }
  };

  const loadTechnicians = async () => {
    try {
      const data = await fetchTechnicians();
      setTechnicians(data);
    } catch (error) {
      console.error('Error loading technicians:', error);
    }
  };

  // Brand management functions
  const handleAddBrand = async () => {
    if (!newBrandName.trim()) {
      Swal.fire('Error', 'Nama brand tidak boleh kosong', 'error');
      return;
    }

    try {
      await addPrinterBrand(newBrandName);
      setNewBrandName('');
      await loadPrinterBrands();
      Swal.fire('Berhasil', 'Brand berhasil ditambahkan', 'success');
    } catch (error) {
      console.error('Error adding brand:', error);
      Swal.fire('Error', 'Gagal menambahkan brand', 'error');
    }
  };

  const handleEditBrand = (brand: any) => {
    setEditingBrand({ ...brand });
  };

  const handleSaveBrand = async () => {
    if (!editingBrand?.name.trim()) {
      Swal.fire('Error', 'Nama brand tidak boleh kosong', 'error');
      return;
    }

    try {
      await updatePrinterBrand(editingBrand.id, editingBrand.name);
      setEditingBrand(null);
      await loadPrinterBrands();
      Swal.fire('Berhasil', 'Brand berhasil diupdate', 'success');
    } catch (error) {
      console.error('Error updating brand:', error);
      Swal.fire('Error', 'Gagal mengupdate brand', 'error');
    }
  };

  const handleDeleteBrand = async (brandId: string, brandName: string) => {
    const result = await Swal.fire({
      title: 'Hapus Brand?',
      text: `Brand "${brandName}" akan dihapus beserta semua modelnya!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await deletePrinterBrand(brandId);
        await loadPrinterBrands();
        Swal.fire('Berhasil', 'Brand berhasil dihapus', 'success');
      } catch (error) {
        console.error('Error deleting brand:', error);
        Swal.fire('Error', 'Gagal menghapus brand', 'error');
      }
    }
  };

  // Model management functions
  const handleAddModel = async () => {
    if (!newModelData.brandId || !newModelData.name.trim()) {
      Swal.fire('Error', 'Brand dan nama model harus diisi', 'error');
      return;
    }

    try {
      await addPrinterModel(newModelData.brandId, newModelData.name, newModelData.type);
      setNewModelData({ brandId: '', name: '', type: 'inkjet' });
      await loadPrinterBrands();
      Swal.fire('Berhasil', 'Model berhasil ditambahkan', 'success');
    } catch (error) {
      console.error('Error adding model:', error);
      Swal.fire('Error', 'Gagal menambahkan model', 'error');
    }
  };

  const handleEditModel = (model: any) => {
    setEditingModel({ ...model });
  };

  const handleSaveModel = async () => {
    if (!editingModel?.name.trim()) {
      Swal.fire('Error', 'Nama model tidak boleh kosong', 'error');
      return;
    }

    try {
      await updatePrinterModel(editingModel.id, editingModel.name, editingModel.type);
      setEditingModel(null);
      await loadPrinterBrands();
      Swal.fire('Berhasil', 'Model berhasil diupdate', 'success');
    } catch (error) {
      console.error('Error updating model:', error);
      Swal.fire('Error', 'Gagal mengupdate model', 'error');
    }
  };

  const handleDeleteModel = async (modelId: string, modelName: string) => {
    const result = await Swal.fire({
      title: 'Hapus Model?',
      text: `Model "${modelName}" akan dihapus!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await deletePrinterModel(modelId);
        await loadPrinterBrands();
        Swal.fire('Berhasil', 'Model berhasil dihapus', 'success');
      } catch (error) {
        console.error('Error deleting model:', error);
        Swal.fire('Error', 'Gagal menghapus model', 'error');
      }
    }
  };

  // Problem Category management functions
  const handleAddProblemCategory = async () => {
    if (!newCategoryData.name.trim() || !newCategoryData.icon.trim()) {
      Swal.fire('Error', 'Nama kategori dan icon harus diisi', 'error');
      return;
    }

    try {
      await addProblemCategory(newCategoryData.name, newCategoryData.icon);
      setNewCategoryData({ name: '', icon: 'Printer' });
      await loadProblemCategories();
      Swal.fire('Berhasil', 'Kategori masalah berhasil ditambahkan', 'success');
    } catch (error) {
      console.error('Error adding problem category:', error);
      Swal.fire('Error', 'Gagal menambahkan kategori masalah', 'error');
    }
  };

  const handleEditProblemCategory = (category: any) => {
    setEditingCategory({ ...category });
  };

  const handleSaveProblemCategory = async () => {
    if (!editingCategory?.name.trim() || !editingCategory?.icon.trim()) {
      Swal.fire('Error', 'Nama kategori dan icon tidak boleh kosong', 'error');
      return;
    }

    try {
      await updateProblemCategory(editingCategory.id, editingCategory.name, editingCategory.icon);
      setEditingCategory(null);
      await loadProblemCategories();
      Swal.fire('Berhasil', 'Kategori masalah berhasil diupdate', 'success');
    } catch (error) {
      console.error('Error updating problem category:', error);
      Swal.fire('Error', 'Gagal mengupdate kategori masalah', 'error');
    }
  };

  const handleDeleteProblemCategory = async (categoryId: string, categoryName: string) => {
    const result = await Swal.fire({
      title: 'Hapus Kategori?',
      text: `Kategori "${categoryName}" akan dihapus beserta semua masalahnya!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await deleteProblemCategory(categoryId);
        await loadProblemCategories();
        Swal.fire('Berhasil', 'Kategori masalah berhasil dihapus', 'success');
      } catch (error) {
        console.error('Error deleting problem category:', error);
        Swal.fire('Error', 'Gagal menghapus kategori masalah', 'error');
      }
    }
  };

  // Problem management functions
  const handleAddProblem = async () => {
    if (!newProblemData.categoryId || !newProblemData.name.trim() || !newProblemData.description.trim()) {
      Swal.fire('Error', 'Kategori, nama, dan deskripsi masalah harus diisi', 'error');
      return;
    }

    try {
      await addProblem(
        newProblemData.categoryId,
        newProblemData.name,
        newProblemData.description,
        newProblemData.severity,
        newProblemData.estimatedTime,
        newProblemData.estimatedCost
      );
      setNewProblemData({
        categoryId: '',
        name: '',
        description: '',
        severity: 'medium',
        estimatedTime: '',
        estimatedCost: ''
      });
      await loadProblemCategories();
      Swal.fire('Berhasil', 'Masalah berhasil ditambahkan', 'success');
    } catch (error) {
      console.error('Error adding problem:', error);
      Swal.fire('Error', 'Gagal menambahkan masalah', 'error');
    }
  };

  const handleEditProblem = (problem: any) => {
    setEditingProblem({ ...problem });
  };

  const handleSaveProblem = async () => {
    if (!editingProblem?.name.trim() || !editingProblem?.description.trim()) {
      Swal.fire('Error', 'Nama dan deskripsi masalah tidak boleh kosong', 'error');
      return;
    }

    try {
      await updateProblem(
        editingProblem.id,
        editingProblem.name,
        editingProblem.description,
        editingProblem.severity,
        editingProblem.estimatedTime,
        editingProblem.estimatedCost
      );
      setEditingProblem(null);
      await loadProblemCategories();
      Swal.fire('Berhasil', 'Masalah berhasil diupdate', 'success');
    } catch (error) {
      console.error('Error updating problem:', error);
      Swal.fire('Error', 'Gagal mengupdate masalah', 'error');
    }
  };

  const handleDeleteProblem = async (problemId: string, problemName: string) => {
    const result = await Swal.fire({
      title: 'Hapus Masalah?',
      text: `Masalah "${problemName}" akan dihapus!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await deleteProblem(problemId);
        await loadProblemCategories();
        Swal.fire('Berhasil', 'Masalah berhasil dihapus', 'success');
      } catch (error) {
        console.error('Error deleting problem:', error);
        Swal.fire('Error', 'Gagal menghapus masalah', 'error');
      }
    }
  };

  // Technician management functions
  const handleAddTechnician = async () => {
    if (!newTechnicianData.name.trim() || !newTechnicianData.phone.trim()) {
      Swal.fire('Error', 'Nama dan nomor HP harus diisi', 'error');
      return;
    }

    try {
      await addTechnician(newTechnicianData);
      setNewTechnicianData({
        name: '',
        phone: '',
        email: '',
        specialization: [],
        experience: 0,
        rating: 5
      });
      await loadTechnicians();
      Swal.fire('Berhasil', 'Teknisi berhasil ditambahkan', 'success');
    } catch (error) {
      console.error('Error adding technician:', error);
      Swal.fire('Error', 'Gagal menambahkan teknisi', 'error');
    }
  };

  const handleEditTechnician = (technician: any) => {
    setEditingTechnician({ ...technician });
  };

  const handleSaveTechnician = async () => {
    if (!editingTechnician?.name.trim() || !editingTechnician?.phone.trim()) {
      Swal.fire('Error', 'Nama dan nomor HP tidak boleh kosong', 'error');
      return;
    }

    try {
      await updateTechnician(editingTechnician.id, editingTechnician);
      setEditingTechnician(null);
      await loadTechnicians();
      Swal.fire('Berhasil', 'Teknisi berhasil diupdate', 'success');
    } catch (error) {
      console.error('Error updating technician:', error);
      Swal.fire('Error', 'Gagal mengupdate teknisi', 'error');
    }
  };

  const handleDeleteTechnician = async (technicianId: string, technicianName: string) => {
    const result = await Swal.fire({
      title: 'Hapus Teknisi?',
      text: `Teknisi "${technicianName}" akan dihapus!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await deleteTechnician(technicianId);
        await loadTechnicians();
        Swal.fire('Berhasil', 'Teknisi berhasil dihapus', 'success');
      } catch (error) {
        console.error('Error deleting technician:', error);
        Swal.fire('Error', 'Gagal menghapus teknisi', 'error');
      }
    }
  };

  // Gallery management functions
  const handleAddGalleryImage = async () => {
    if (!newGalleryData.title.trim() || !newGalleryData.alt_text.trim() || !newGalleryData.image_url.trim()) {
      Swal.fire('Error', 'Judul, alt text, dan URL gambar harus diisi', 'error');
      return;
    }

    try {
      await addGalleryImage(newGalleryData);
      setNewGalleryData({
        title: '',
        alt_text: '',
        image_url: '',
        category: 'service',
        sort_order: 0
      });
      await loadGalleryImages();
      Swal.fire('Berhasil', 'Gambar berhasil ditambahkan ke gallery', 'success');
    } catch (error) {
      console.error('Error adding gallery image:', error);
      Swal.fire('Error', 'Gagal menambahkan gambar', 'error');
    }
  };

  const handleEditGalleryImage = (image: any) => {
    setEditingGallery({ ...image });
  };

  const handleSaveGalleryImage = async () => {
    if (!editingGallery?.title.trim() || !editingGallery?.alt_text.trim() || !editingGallery?.image_url.trim()) {
      Swal.fire('Error', 'Judul, alt text, dan URL gambar tidak boleh kosong', 'error');
      return;
    }

    try {
      await updateGalleryImage(editingGallery.id, editingGallery);
      setEditingGallery(null);
      await loadGalleryImages();
      Swal.fire('Berhasil', 'Gambar berhasil diupdate', 'success');
    } catch (error) {
      console.error('Error updating gallery image:', error);
      Swal.fire('Error', 'Gagal mengupdate gambar', 'error');
    }
  };

  const handleDeleteGalleryImage = async (imageId: string, imageTitle: string) => {
    const result = await Swal.fire({
      title: 'Hapus Gambar?',
      text: `Gambar "${imageTitle}" akan dihapus!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await deleteGalleryImage(imageId);
        await loadGalleryImages();
        Swal.fire('Berhasil', 'Gambar berhasil dihapus', 'success');
      } catch (error) {
        console.error('Error deleting gallery image:', error);
        Swal.fire('Error', 'Gagal menghapus gambar', 'error');
      }
    }
  };

  // Statistics
  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    completedBookings: bookings.filter(b => b.status === 'completed').length,
    totalRevenue: bookings
      .filter(b => b.actualCost)
      .reduce((sum, b) => sum + parseInt(b.actualCost.replace(/\D/g, '') || '0'), 0)
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'confirmed': return 'Dikonfirmasi';
      case 'in-progress': return 'Dalam Proses';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      await loadBookings();
      Swal.fire('Berhasil', 'Status booking berhasil diupdate', 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      Swal.fire('Error', 'Gagal mengupdate status', 'error');
    }
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
            <div className="flex items-center space-x-4">
              <img src="/img/logo.jpeg" alt="Logo" className="h-10 w-10 rounded-full" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Barokah Printer Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('home')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                Lihat Website
              </button>
              <button
                onClick={onLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: TrendingUp },
              { id: 'bookings', name: 'Booking Management', icon: Calendar },
              { id: 'printers', name: 'Manajemen Merk Printer', icon: Printer },
              { id: 'problems', name: 'Problem Categories', icon: Settings },
              { id: 'technicians', name: 'Technicians', icon: Users },
              { id: 'gallery', name: 'Gallery', icon: Image }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Booking</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.pendingBookings}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.completedBookings}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      Rp {stats.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.slice(0, 5).map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{booking.customer.name}</div>
                            <div className="text-sm text-gray-500">{booking.customer.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.printer.brand} {booking.printer.model}</div>
                          <div className="text-sm text-gray-500">{booking.problem.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(booking.service.date).toLocaleDateString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari berdasarkan ID, nama, atau nomor HP..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Semua Status</option>
                    <option value="pending">Menunggu</option>
                    <option value="confirmed">Dikonfirmasi</option>
                    <option value="in-progress">Dalam Proses</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>
                </div>
                <button
                  onClick={loadBookings}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID & Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Printer & Masalah</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teknisi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">#{booking.id}</div>
                            <div className="text-sm text-gray-500">{booking.customer.name}</div>
                            <div className="text-sm text-gray-500">{booking.customer.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{booking.printer.brand} {booking.printer.model}</div>
                            <div className="text-sm text-gray-500">{booking.problem.category}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.technician}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                            className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusColor(booking.status)}`}
                          >
                            <option value="pending">Menunggu</option>
                            <option value="confirmed">Dikonfirmasi</option>
                            <option value="in-progress">Dalam Proses</option>
                            <option value="completed">Selesai</option>
                            <option value="cancelled">Dibatalkan</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              title="Lihat Detail"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              className="text-green-600 hover:text-green-900"
                              title="Tugaskan Teknisi"
                            >
                              <Users className="h-4 w-4" />
                            </button>
                            <button
                              className="text-purple-600 hover:text-purple-900"
                              title="Update Biaya"
                            >
                              <Edit className="h-4 w-4" />
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
        )}

        {/* Printer Management Tab */}
        {activeTab === 'printers' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Manajemen Merk Printer</h3>
              </div>
              <div className="p-6">
                {/* Add New Brand */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Tambah Merk Baru</h4>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newBrandName}
                      onChange={(e) => setNewBrandName(e.target.value)}
                      placeholder="Nama merk printer..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={handleAddBrand}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Tambah</span>
                    </button>
                  </div>
                </div>

                {/* Brands List */}
                <div className="space-y-6">
                  {printerBrands.map((brand) => (
                    <div key={brand.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        {editingBrand?.id === brand.id ? (
                          <div className="flex items-center space-x-3 flex-1">
                            <input
                              type="text"
                              value={editingBrand.name}
                              onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              onClick={handleSaveBrand}
                              className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 flex items-center space-x-1"
                            >
                              <Save className="h-4 w-4" />
                              <span>Simpan</span>
                            </button>
                            <button
                              onClick={() => setEditingBrand(null)}
                              className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 flex items-center space-x-1"
                            >
                              <X className="h-4 w-4" />
                              <span>Batal</span>
                            </button>
                          </div>
                        ) : (
                          <>
                            <h4 className="text-lg font-semibold text-gray-900">{brand.name}</h4>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditBrand(brand)}
                                className="bg-yellow-600 text-white px-3 py-2 rounded-md hover:bg-yellow-700 flex items-center space-x-1"
                              >
                                <Edit className="h-4 w-4" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteBrand(brand.id, brand.name)}
                                className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 flex items-center space-x-1"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Add New Model */}
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Tambah Model Baru</h5>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newModelData.brandId === brand.id ? newModelData.name : ''}
                            onChange={(e) => setNewModelData({ ...newModelData, brandId: brand.id, name: e.target.value })}
                            placeholder="Nama model..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                          <select
                            value={newModelData.brandId === brand.id ? newModelData.type : 'inkjet'}
                            onChange={(e) => setNewModelData({ ...newModelData, brandId: brand.id, type: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                          >
                            <option value="inkjet">Inkjet</option>
                            <option value="laser">Laser</option>
                            <option value="multifunction">Multifunction</option>
                          </select>
                          <button
                            onClick={() => {
                              setNewModelData({ ...newModelData, brandId: brand.id });
                              handleAddModel();
                            }}
                            className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-1 text-sm"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Tambah</span>
                          </button>
                        </div>
                      </div>

                      {/* Models List */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {brand.models.map((model: any) => (
                          <div key={model.id} className="bg-gray-50 p-3 rounded-lg">
                            {editingModel?.id === model.id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editingModel.name}
                                  onChange={(e) => setEditingModel({ ...editingModel, name: e.target.value })}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                                <select
                                  value={editingModel.type}
                                  onChange={(e) => setEditingModel({ ...editingModel, type: e.target.value })}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="inkjet">Inkjet</option>
                                  <option value="laser">Laser</option>
                                  <option value="multifunction">Multifunction</option>
                                </select>
                                <div className="flex space-x-1">
                                  <button
                                    onClick={handleSaveModel}
                                    className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 flex items-center space-x-1"
                                  >
                                    <Save className="h-3 w-3" />
                                    <span>Simpan</span>
                                  </button>
                                  <button
                                    onClick={() => setEditingModel(null)}
                                    className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700 flex items-center space-x-1"
                                  >
                                    <X className="h-3 w-3" />
                                    <span>Batal</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center justify-between mb-2">
                                  <h6 className="font-medium text-gray-900 text-sm">{model.name}</h6>
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={() => handleEditModel(model)}
                                      className="bg-yellow-600 text-white px-2 py-1 rounded text-xs hover:bg-yellow-700 flex items-center space-x-1"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteModel(model.id, model.name)}
                                      className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 flex items-center space-x-1"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  {model.type}
                                </span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Problem Categories Tab */}
        {activeTab === 'problems' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Manajemen Kategori Masalah</h3>
              </div>
              <div className="p-6">
                {/* Add New Category */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Tambah Kategori Baru</h4>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newCategoryData.name}
                      onChange={(e) => setNewCategoryData({ ...newCategoryData, name: e.target.value })}
                      placeholder="Nama kategori..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={newCategoryData.icon}
                      onChange={(e) => setNewCategoryData({ ...newCategoryData, icon: e.target.value })}
                      placeholder="Icon (contoh: Printer)"
                      className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={handleAddProblemCategory}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Tambah</span>
                    </button>
                  </div>
                </div>

                {/* Categories List */}
                <div className="space-y-6">
                  {problemCategories.map((category) => (
                    <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        {editingCategory?.id === category.id ? (
                          <div className="flex items-center space-x-3 flex-1">
                            <input
                              type="text"
                              value={editingCategory.name}
                              onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                              type="text"
                              value={editingCategory.icon}
                              onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              onClick={handleSaveProblemCategory}
                              className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 flex items-center space-x-1"
                            >
                              <Save className="h-4 w-4" />
                              <span>Simpan</span>
                            </button>
                            <button
                              onClick={() => setEditingCategory(null)}
                              className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 flex items-center space-x-1"
                            >
                              <X className="h-4 w-4" />
                              <span>Batal</span>
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center space-x-3">
                              <Wrench className="h-5 w-5 text-gray-600" />
                              <h4 className="text-lg font-semibold text-gray-900">{category.name}</h4>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditProblemCategory(category)}
                                className="bg-yellow-600 text-white px-3 py-2 rounded-md hover:bg-yellow-700 flex items-center space-x-1"
                              >
                                <Edit className="h-4 w-4" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProblemCategory(category.id, category.name)}
                                className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 flex items-center space-x-1"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Add New Problem */}
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Tambah Masalah Baru</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <input
                            type="text"
                            value={newProblemData.categoryId === category.id ? newProblemData.name : ''}
                            onChange={(e) => setNewProblemData({ ...newProblemData, categoryId: category.id, name: e.target.value })}
                            placeholder="Nama masalah..."
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                          <select
                            value={newProblemData.categoryId === category.id ? newProblemData.severity : 'medium'}
                            onChange={(e) => setNewProblemData({ ...newProblemData, categoryId: category.id, severity: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                          >
                            <option value="low">Ringan</option>
                            <option value="medium">Sedang</option>
                            <option value="high">Berat</option>
                          </select>
                          <input
                            type="text"
                            value={newProblemData.categoryId === category.id ? newProblemData.estimatedTime : ''}
                            onChange={(e) => setNewProblemData({ ...newProblemData, categoryId: category.id, estimatedTime: e.target.value })}
                            placeholder="Estimasi waktu (contoh: 1-2 jam)"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                          <input
                            type="text"
                            value={newProblemData.categoryId === category.id ? newProblemData.estimatedCost : ''}
                            onChange={(e) => setNewProblemData({ ...newProblemData, categoryId: category.id, estimatedCost: e.target.value })}
                            placeholder="Estimasi biaya (contoh: Rp 50.000)"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </div>
                        <textarea
                          value={newProblemData.categoryId === category.id ? newProblemData.description : ''}
                          onChange={(e) => setNewProblemData({ ...newProblemData, categoryId: category.id, description: e.target.value })}
                          placeholder="Deskripsi masalah..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm mb-3"
                        />
                        <button
                          onClick={() => {
                            setNewProblemData({ ...newProblemData, categoryId: category.id });
                            handleAddProblem();
                          }}
                          className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-1 text-sm"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Tambah Masalah</span>
                        </button>
                      </div>

                      {/* Problems List */}
                      <div className="space-y-3">
                        {category.problems.map((problem: any) => (
                          <div key={problem.id} className="bg-gray-50 p-3 rounded-lg">
                            {editingProblem?.id === problem.id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editingProblem.name}
                                  onChange={(e) => setEditingProblem({ ...editingProblem, name: e.target.value })}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                                <textarea
                                  value={editingProblem.description}
                                  onChange={(e) => setEditingProblem({ ...editingProblem, description: e.target.value })}
                                  rows={2}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="grid grid-cols-3 gap-2">
                                  <select
                                    value={editingProblem.severity}
                                    onChange={(e) => setEditingProblem({ ...editingProblem, severity: e.target.value })}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="low">Ringan</option>
                                    <option value="medium">Sedang</option>
                                    <option value="high">Berat</option>
                                  </select>
                                  <input
                                    type="text"
                                    value={editingProblem.estimatedTime}
                                    onChange={(e) => setEditingProblem({ ...editingProblem, estimatedTime: e.target.value })}
                                    placeholder="Waktu"
                                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                                  />
                                  <input
                                    type="text"
                                    value={editingProblem.estimatedCost}
                                    onChange={(e) => setEditingProblem({ ...editingProblem, estimatedCost: e.target.value })}
                                    placeholder="Biaya"
                                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div className="flex space-x-1">
                                  <button
                                    onClick={handleSaveProblem}
                                    className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 flex items-center space-x-1"
                                  >
                                    <Save className="h-3 w-3" />
                                    <span>Simpan</span>
                                  </button>
                                  <button
                                    onClick={() => setEditingProblem(null)}
                                    className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700 flex items-center space-x-1"
                                  >
                                    <X className="h-3 w-3" />
                                    <span>Batal</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center justify-between mb-2">
                                  <h6 className="font-medium text-gray-900 text-sm">{problem.name}</h6>
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={() => handleEditProblem(problem)}
                                      className="bg-yellow-600 text-white px-2 py-1 rounded text-xs hover:bg-yellow-700 flex items-center space-x-1"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProblem(problem.id, problem.name)}
                                      className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 flex items-center space-x-1"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">{problem.description}</p>
                                <div className="flex space-x-2 text-xs">
                                  <span className={`px-2 py-1 rounded-full ${
                                    problem.severity === 'low' ? 'bg-green-100 text-green-800' :
                                    problem.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {problem.severity === 'low' ? 'Ringan' : problem.severity === 'medium' ? 'Sedang' : 'Berat'}
                                  </span>
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    {problem.estimatedTime}
                                  </span>
                                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                    {problem.estimatedCost}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Technicians Tab */}
        {activeTab === 'technicians' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Manajemen Teknisi</h3>
              </div>
              <div className="p-6">
                {/* Add New Technician */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Tambah Teknisi Baru</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      value={newTechnicianData.name}
                      onChange={(e) => setNewTechnicianData({ ...newTechnicianData, name: e.target.value })}
                      placeholder="Nama lengkap..."
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={newTechnicianData.phone}
                      onChange={(e) => setNewTechnicianData({ ...newTechnicianData, phone: e.target.value })}
                      placeholder="Nomor HP..."
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="email"
                      value={newTechnicianData.email}
                      onChange={(e) => setNewTechnicianData({ ...newTechnicianData, email: e.target.value })}
                      placeholder="Email (opsional)..."
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="number"
                      value={newTechnicianData.experience}
                      onChange={(e) => setNewTechnicianData({ ...newTechnicianData, experience: parseInt(e.target.value) || 0 })}
                      placeholder="Pengalaman (tahun)..."
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <input
                    type="text"
                    value={newTechnicianData.specialization.join(', ')}
                    onChange={(e) => setNewTechnicianData({ ...newTechnicianData, specialization: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="Spesialisasi (pisahkan dengan koma)..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-3"
                  />
                  <button
                    onClick={handleAddTechnician}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Teknisi</span>
                  </button>
                </div>

                {/* Technicians List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {technicians.map((technician) => (
                    <div key={technician.id} className="border border-gray-200 rounded-lg p-4">
                      {editingTechnician?.id === technician.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editingTechnician.name}
                            onChange={(e) => setEditingTechnician({ ...editingTechnician, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={editingTechnician.phone}
                            onChange={(e) => setEditingTechnician({ ...editingTechnician, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="email"
                            value={editingTechnician.email}
                            onChange={(e) => setEditingTechnician({ ...editingTechnician, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={editingTechnician.specialization.join(', ')}
                            onChange={(e) => setEditingTechnician({ ...editingTechnician, specialization: e.target.value.split(',').map((s: string) => s.trim()) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="number"
                            value={editingTechnician.experience}
                            onChange={(e) => setEditingTechnician({ ...editingTechnician, experience: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSaveTechnician}
                              className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 flex items-center space-x-1 text-sm"
                            >
                              <Save className="h-3 w-3" />
                              <span>Simpan</span>
                            </button>
                            <button
                              onClick={() => setEditingTechnician(null)}
                              className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 flex items-center space-x-1 text-sm"
                            >
                              <X className="h-3 w-3" />
                              <span>Batal</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-semibold text-gray-900">{technician.name}</h4>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              technician.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {technician.is_available ? 'Tersedia' : 'Sibuk'}
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Phone className="h-4 w-4" />
                              <span>{technician.phone}</span>
                            </div>
                            {technician.email && (
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Mail className="h-4 w-4" />
                                <span>{technician.email}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Star className="h-4 w-4" />
                              <span>{technician.rating}/5.0 ({technician.experience} tahun)</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Spesialisasi:</p>
                            <div className="flex flex-wrap gap-1">
                              {technician.specialization.map((spec: string, index: number) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditTechnician(technician)}
                              className="bg-yellow-600 text-white px-3 py-2 rounded-md hover:bg-yellow-700 flex items-center space-x-1 text-sm"
                            >
                              <Edit className="h-3 w-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteTechnician(technician.id, technician.name)}
                              className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 flex items-center space-x-1 text-sm"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Manajemen Gallery</h3>
              </div>
              <div className="p-6">
                {/* Add New Gallery Image */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Tambah Gambar Baru</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      value={newGalleryData.title}
                      onChange={(e) => setNewGalleryData({ ...newGalleryData, title: e.target.value })}
                      placeholder="Judul gambar..."
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={newGalleryData.alt_text}
                      onChange={(e) => setNewGalleryData({ ...newGalleryData, alt_text: e.target.value })}
                      placeholder="Alt text..."
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="url"
                      value={newGalleryData.image_url}
                      onChange={(e) => setNewGalleryData({ ...newGalleryData, image_url: e.target.value })}
                      placeholder="URL gambar..."
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <select
                      value={newGalleryData.category}
                      onChange={(e) => setNewGalleryData({ ...newGalleryData, category: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="service">Service</option>
                      <option value="workshop">Workshop</option>
                      <option value="team">Team</option>
                      <option value="products">Products</option>
                      <option value="store">Store</option>
                      <option value="equipment">Equipment</option>
                      <option value="parts">Parts</option>
                    </select>
                  </div>
                  <input
                    type="number"
                    value={newGalleryData.sort_order}
                    onChange={(e) => setNewGalleryData({ ...newGalleryData, sort_order: parseInt(e.target.value) || 0 })}
                    placeholder="Urutan (opsional)..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-3"
                  />
                  <button
                    onClick={handleAddGalleryImage}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Gambar</span>
                  </button>
                </div>

                {/* Gallery Images Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={image.image_url}
                          alt={image.alt_text}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        {editingGallery?.id === image.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editingGallery.title}
                              onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                              type="text"
                              value={editingGallery.alt_text}
                              onChange={(e) => setEditingGallery({ ...editingGallery, alt_text: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                              type="url"
                              value={editingGallery.image_url}
                              onChange={(e) => setEditingGallery({ ...editingGallery, image_url: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            <select
                              value={editingGallery.category}
                              onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="service">Service</option>
                              <option value="workshop">Workshop</option>
                              <option value="team">Team</option>
                              <option value="products">Products</option>
                              <option value="store">Store</option>
                              <option value="equipment">Equipment</option>
                              <option value="parts">Parts</option>
                            </select>
                            <input
                              type="number"
                              value={editingGallery.sort_order}
                              onChange={(e) => setEditingGallery({ ...editingGallery, sort_order: parseInt(e.target.value) || 0 })}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="flex space-x-1">
                              <button
                                onClick={handleSaveGalleryImage}
                                className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 flex items-center space-x-1"
                              >
                                <Save className="h-3 w-3" />
                                <span>Simpan</span>
                              </button>
                              <button
                                onClick={() => setEditingGallery(null)}
                                className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700 flex items-center space-x-1"
                              >
                                <X className="h-3 w-3" />
                                <span>Batal</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h4 className="font-semibold text-gray-900 mb-1 truncate">{image.title}</h4>
                            <p className="text-sm text-gray-600 mb-2 truncate">{image.alt_text}</p>
                            <div className="flex justify-between items-center mb-3">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                                {image.category}
                              </span>
                              <span className="text-xs text-gray-500">#{image.sort_order}</span>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditGalleryImage(image)}
                                className="flex-1 bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-1"
                              >
                                <Edit className="h-3 w-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteGalleryImage(image.id, image.title)}
                                className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {galleryImages.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Belum ada gambar di gallery</p>
                    <button
                      onClick={handleAddGalleryImage}
                      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Tambah Gambar Pertama
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;