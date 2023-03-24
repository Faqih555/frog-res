   // Ambil elemen yang dibutuhkan
   const dropdownTrigger = document.querySelector('#arrow');
   const dropdownMenu = document.querySelector('#submenu');
 
   // Tambahkan event listener pada tombol dropdown
   dropdownTrigger.addEventListener('click', () => {
     dropdownMenu.classList.toggle('hidden');
   });