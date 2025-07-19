import Swal from 'sweetalert2';

// Custom SweetAlert configurations for consistent styling
export const SweetAlertConfig = {
  // Success alerts
  success: (title: string, text?: string, timer: number = 2000) => {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      timer,
      showConfirmButton: false,
      toast: false,
      position: 'center',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        content: 'swal-custom-content'
      }
    });
  },

  // Error alerts
  error: (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        content: 'swal-custom-content'
      }
    });
  },

  // Warning alerts
  warning: (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      confirmButtonColor: '#f59e0b',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        content: 'swal-custom-content'
      }
    });
  },

  // Info alerts
  info: (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'info',
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        content: 'swal-custom-content'
      }
    });
  },

  // Confirmation dialogs
  confirm: (title: string, text?: string, confirmText: string = 'Ya', cancelText: string = 'Batal') => {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true,
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        content: 'swal-custom-content'
      }
    });
  },

  // Delete confirmation
  confirmDelete: (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        content: 'swal-custom-content'
      }
    });
  },

  // Toast notifications
  toast: {
    success: (message: string) => {
      return Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'swal-toast-popup'
        }
      });
    },
    error: (message: string) => {
      return Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        customClass: {
          popup: 'swal-toast-popup'
        }
      });
    },
    warning: (message: string) => {
      return Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: message,
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,
        customClass: {
          popup: 'swal-toast-popup'
        }
      });
    },
    info: (message: string) => {
      return Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'swal-toast-popup'
        }
      });
    }
  },

  // Loading dialog
  loading: (title: string = 'Memproses...', text?: string) => {
    return Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        content: 'swal-custom-content'
      }
    });
  },

  // Close any open SweetAlert
  close: () => {
    Swal.close();
  }
};

// Specific alert functions for common use cases
export const showSuccessAlert = (message: string, timer?: number) => {
  return SweetAlertConfig.success('Berhasil!', message, timer);
};

export const showErrorAlert = (message: string) => {
  return SweetAlertConfig.error('Error!', message);
};

export const showWarningAlert = (message: string) => {
  return SweetAlertConfig.warning('Peringatan!', message);
};

export const showInfoAlert = (message: string) => {
  return SweetAlertConfig.info('Info', message);
};

export const showDeleteConfirm = (itemName: string = 'item ini') => {
  return SweetAlertConfig.confirmDelete(
    `Hapus ${itemName}?`,
    `Data ${itemName} akan dihapus secara permanen!`
  );
};

export const showStatusUpdateConfirm = (status: string) => {
  const statusText = {
    'confirmed': 'dikonfirmasi',
    'cancelled': 'dibatalkan',
    'in-progress': 'sedang dikerjakan',
    'completed': 'selesai'
  }[status] || status;

  return SweetAlertConfig.confirm(
    'Ubah Status Booking?',
    `Booking akan ${statusText}`
  );
};

// Welcome message for admin login
export const showWelcomeAlert = (username: string) => {
  return Swal.fire({
    title: '🎉 Selamat Datang!',
    html: `
      <div class="text-center">
        <div class="mb-4">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-3">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <p class="text-lg font-semibold text-gray-700 mb-2">Halo, <span class="text-blue-600">${username}</span>!</p>
        <p class="text-gray-600">Login berhasil. Anda akan diarahkan ke dashboard admin.</p>
      </div>
    `,
    icon: 'success',
    timer: 2500,
    timerProgressBar: true,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    backdrop: `
      rgba(59, 130, 246, 0.1)
      url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3ctext y='.9em' font-size='90'%3e🎊%3c/text%3e%3c/svg%3e")
      left top
      no-repeat
    `,
    customClass: {
      popup: 'swal-custom-popup animate-pulse',
      title: 'swal-custom-title',
      content: 'swal-custom-content'
    },
    didOpen: () => {
      // Add entrance animation
      const popup = Swal.getPopup();
      if (popup) {
        popup.style.animation = 'bounceIn 0.6s ease-out';
      }
    },
    willClose: () => {
      // Ensure popup is properly closed before navigation
      const popup = Swal.getPopup();
      if (popup) {
        popup.style.animation = 'fadeOut 0.3s ease-in';
      }
    }
  });
};

export default SweetAlertConfig;