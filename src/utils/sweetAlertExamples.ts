import Swal from 'sweetalert2';
import { SweetAlertConfig } from './sweetAlert';

// Advanced SweetAlert examples for specific use cases
export const SweetAlertExamples = {
  // Input dialog for adding new items
  addItemDialog: async (itemType: string = 'item') => {
    const { value: itemName } = await Swal.fire({
      title: `Tambah ${itemType} Baru`,
      input: 'text',
      inputLabel: `Nama ${itemType}`,
      inputPlaceholder: `Masukkan nama ${itemType}...`,
      showCancelButton: true,
      confirmButtonText: 'Tambah',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      inputValidator: (value) => {
        if (!value) {
          return `Nama ${itemType} tidak boleh kosong!`;
        }
        if (value.length < 2) {
          return `Nama ${itemType} minimal 2 karakter!`;
        }
      },
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        content: 'swal-custom-content'
      }
    });

    return itemName;
  },

  // Multi-step form dialog
  multiStepForm: async () => {
    const steps = ['1', '2', '3'];
    const Queue = Swal.mixin({
      progressSteps: steps,
      confirmButtonText: 'Lanjut',
      cancelButtonText: 'Batal',
      showCancelButton: true,
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        content: 'swal-custom-content'
      }
    });

    const results: any = {};

    // Step 1
    const step1 = await Queue.fire({
      title: 'Informasi Dasar',
      text: 'Masukkan nama lengkap',
      input: 'text',
      inputPlaceholder: 'Nama lengkap...',
      currentProgressStep: 0,
      inputValidator: (value) => {
        if (!value) return 'Nama tidak boleh kosong!';
      }
    });

    if (step1.dismiss) return null;
    results.name = step1.value;

    // Step 2
    const step2 = await Queue.fire({
      title: 'Kontak',
      text: 'Masukkan nomor telepon',
      input: 'tel',
      inputPlaceholder: '08xxxxxxxxxx',
      currentProgressStep: 1,
      inputValidator: (value) => {
        if (!value) return 'Nomor telepon tidak boleh kosong!';
        if (!/^08\d{8,11}$/.test(value)) return 'Format nomor telepon tidak valid!';
      }
    });

    if (step2.dismiss) return null;
    results.phone = step2.value;

    // Step 3
    const step3 = await Queue.fire({
      title: 'Konfirmasi',
      html: `
        <div class="text-left space-y-2">
          <p><strong>Nama:</strong> ${results.name}</p>
          <p><strong>Telepon:</strong> ${results.phone}</p>
        </div>
      `,
      confirmButtonText: 'Simpan',
      currentProgressStep: 2
    });

    if (step3.dismiss) return null;

    return results;
  },

  // Progress bar dialog
  progressDialog: async (title: string = 'Memproses...') => {
    let timerInterval: NodeJS.Timeout;
    
    const result = await Swal.fire({
      title,
      html: 'Waktu tersisa: <b></b> detik.',
      timer: 5000,
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup()?.querySelector('b');
        timerInterval = setInterval(() => {
          if (timer) {
            timer.textContent = `${Math.ceil((Swal.getTimerLeft() || 0) / 1000)}`;
          }
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        content: 'swal-custom-content'
      }
    });

    return result;
  },

  // Image preview dialog
  imagePreview: (imageUrl: string, title: string = 'Preview Gambar') => {
    return Swal.fire({
      title,
      imageUrl,
      imageWidth: 400,
      imageHeight: 300,
      imageAlt: 'Preview image',
      confirmButtonText: 'Tutup',
      confirmButtonColor: '#3b82f6',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        content: 'swal-custom-content'
      }
    });
  },

  // HTML content dialog
  htmlDialog: (title: string, htmlContent: string) => {
    return Swal.fire({
      title,
      html: htmlContent,
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        content: 'swal-custom-content'
      }
    });
  },

  // Auto-close success with custom animation
  successWithAnimation: (message: string) => {
    return Swal.fire({
      title: 'Berhasil!',
      text: message,
      icon: 'success',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: false,
      position: 'center',
      backdrop: `
        rgba(0,123,255,0.4)
        url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3ctext y='.9em' font-size='90'%3e🎉%3c/text%3e%3c/svg%3e")
        left top
        no-repeat
      `,
      customClass: {
        popup: 'swal-custom-popup animate-bounce',
        title: 'swal-custom-title',
        content: 'swal-custom-content'
      }
    });
  },

  // Network error dialog
  networkError: () => {
    return SweetAlertConfig.error(
      'Koneksi Bermasalah',
      'Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.'
    );
  },

  // Maintenance mode dialog
  maintenanceMode: () => {
    return Swal.fire({
      title: 'Sedang Maintenance',
      text: 'Sistem sedang dalam pemeliharaan. Silakan coba lagi nanti.',
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        content: 'swal-custom-content'
      }
    });
  },

  // Feature coming soon dialog
  comingSoon: (featureName: string = 'Fitur ini') => {
    return Swal.fire({
      title: 'Coming Soon! 🚀',
      text: `${featureName} akan segera tersedia dalam update mendatang.`,
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6',
      footer: '<small>Terima kasih atas kesabaran Anda</small>',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        content: 'swal-custom-content'
      }
    });
  }
};

export default SweetAlertExamples;