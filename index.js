/**
 * Main Application - CLI Interface
 * File ini adalah entry point aplikasi
 * 
 * TODO: Implementasikan CLI interface yang interaktif dengan menu:
 * 1. Tambah Siswa Baru
 * 2. Lihat Semua Siswa
 * 3. Cari Siswa (by ID)
 * 4. Update Data Siswa
 * 5. Hapus Siswa
 * 6. Tambah Nilai Siswa
 * 7. Lihat Top 3 Siswa
 * 8. Keluar
 */

import fs from 'fs';
import path from 'path';
import readlineSync from 'readline-sync';
import Student from './src/Student.js';
import StudentManager from './src/StudentManager.js';

// Inisialisasi StudentManager
const manager = new StudentManager();
// persistence file
const dataDir = path.resolve('./data');
const dataFile = path.join(dataDir, 'students.json');
manager.setDataFile(dataFile);

// load existing data if present
function loadData() {
  try {
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, 'utf8');
      const arr = JSON.parse(raw || '[]');
      manager.loadFromObjectArray(arr, Student);
    }
  } catch (err) {
    console.error('Gagal memuat data:', err.message);
  }
}

function saveData() {
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const serial = manager.toSerializable();
    fs.writeFileSync(dataFile, JSON.stringify(serial, null, 2), 'utf8');
  } catch (err) {
    console.error('Gagal menyimpan data:', err.message);
  }
}

// load on start
loadData();

/**
 * Menampilkan menu utama
 */
function displayMenu() {
  console.log('\n=================================');
  console.log('SISTEM MANAJEMEN NILAI SISWA');
  console.log('=================================');
  console.log('1. Tambah Siswa Baru');
  console.log('2. Lihat Semua Siswa');
  console.log('3. Cari Siswa');
  console.log('4. Update Data Siswa');
  console.log('5. Hapus Siswa');
  console.log('6. Tambah Nilai Siswa');
  console.log('7. Lihat Top 3 Siswa');
  console.log('8. Keluar');
  console.log('=================================');
}

/**
 * Handler untuk menambah siswa baru
 * TODO: Implementasikan function ini
 * - Minta input: ID, Nama, Kelas
 * - Buat object Student baru
 * - Tambahkan ke manager
 * - Tampilkan pesan sukses/gagal
 */
function addNewStudent() {
  // Implementasi di sini
  console.log('\n--- Tambah Siswa Baru ---');
  try {
    const id = readlineSync.question('ID: ');
    const name = readlineSync.question('Nama: ');
    const studentClass = readlineSync.question('Kelas: ');

    if (!id || !name) {
      console.log('ID dan Nama wajib diisi.');
      return;
    }

    const student = new Student(id, name, studentClass);
    const ok = manager.addStudent(student);
    if (ok) {
      saveData();
      console.log('Siswa berhasil ditambahkan.');
    } else {
      console.log('Gagal menambah siswa: ID sudah ada.');
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

/**
 * Handler untuk melihat semua siswa
 * TODO: Implementasikan function ini
 * - Panggil method displayAllStudents dari manager
 * - Jika tidak ada siswa, tampilkan pesan
 */
function viewAllStudents() {
  // Implementasi di sini
  console.log('\n--- Daftar Semua Siswa ---');
  manager.displayAllStudents();
}

/**
 * Handler untuk mencari siswa berdasarkan ID
 * TODO: Implementasikan function ini
 * - Minta input ID
 * - Cari siswa menggunakan manager
 * - Tampilkan info siswa jika ditemukan
 */
function searchStudent() {
  // Implementasi di sini
  console.log('\n--- Cari Siswa ---');
  const id = readlineSync.question('Masukkan ID siswa: ');
  const s = manager.findStudent(id);
  if (!s) {
    console.log('Siswa tidak ditemukan.');
    return;
  }
  if (typeof s.displayInfo === 'function') s.displayInfo(); else console.log(s);
}

/**
 * Handler untuk update data siswa
 * TODO: Implementasikan function ini
 * - Minta input ID siswa
 * - Tampilkan data saat ini
 * - Minta input data baru (nama, kelas)
 * - Update menggunakan manager
 */
function updateStudent() {
  // Implementasi di sini
  console.log('\n--- Update Data Siswa ---');
  const id = readlineSync.question('Masukkan ID siswa yang akan diupdate: ');
  const s = manager.findStudent(id);
  if (!s) {
    console.log('Siswa tidak ditemukan.');
    return;
  }
  console.log('Data saat ini:');
  if (typeof s.displayInfo === 'function') s.displayInfo(); else console.log(s);

  const newName = readlineSync.question('Nama baru (kosongkan untuk tidak mengubah): ');
  const newClass = readlineSync.question('Kelas baru (kosongkan untuk tidak mengubah): ');

  const data = {};
  if (newName && String(newName).trim() !== '') data.name = newName;
  if (newClass && String(newClass).trim() !== '') data.class = newClass;

  const ok = manager.updateStudent(id, data);
  if (ok) {
    saveData();
    console.log('Data siswa berhasil diperbarui.');
  } else {
    console.log('Gagal memperbarui data siswa. Pastikan input valid.');
  }
}

/**
 * Handler untuk menghapus siswa
 * TODO: Implementasikan function ini
 * - Minta input ID siswa
 * - Konfirmasi penghapusan
 * - Hapus menggunakan manager
 */
function deleteStudent() {
  // Implementasi di sini
  console.log('\n--- Hapus Siswa ---');
  const id = readlineSync.question('Masukkan ID siswa yang akan dihapus: ');
  const s = manager.findStudent(id);
  if (!s) {
    console.log('Siswa tidak ditemukan.');
    return;
  }
  const confirm = readlineSync.question('Yakin ingin menghapus siswa ini? (y/N): ');
  if (confirm.toLowerCase() === 'y') {
    const ok = manager.removeStudent(id);
    if (ok) {
      saveData();
      console.log('Siswa berhasil dihapus.');
    } else {
      console.log('Gagal menghapus siswa.');
    }
  } else {
    console.log('Penghapusan dibatalkan.');
  }
}

/**
 * Handler untuk menambah nilai siswa
 * TODO: Implementasikan function ini
 * - Minta input ID siswa
 * - Tampilkan data siswa
 * - Minta input mata pelajaran dan nilai
 * - Tambahkan nilai menggunakan method addGrade
 */
function addGradeToStudent() {
  // Implementasi di sini
  console.log('\n--- Tambah Nilai Siswa ---');
  try {
    const id = readlineSync.question('Masukkan ID siswa: ');
    const s = manager.findStudent(id);
    if (!s) {
      console.log('Siswa tidak ditemukan.');
      return;
    }
    console.log('Siswa:');
    if (typeof s.displayInfo === 'function') s.displayInfo(); else console.log(s);

    const subject = readlineSync.question('Mata pelajaran: ');
    const scoreStr = readlineSync.question('Nilai (0-100): ');
    const score = Number(scoreStr);
    s.addGrade(subject, score);
    saveData();
    console.log('Nilai berhasil ditambahkan/diperbarui.');
  } catch (err) {
    console.log('Error:', err.message);
  }
}

/**
 * Handler untuk melihat top students
 * TODO: Implementasikan function ini
 * - Panggil getTopStudents(3) dari manager
 * - Tampilkan informasi siswa
 */
function viewTopStudents() {
  // Implementasi di sini
  console.log('\n--- Top 3 Siswa ---');
  const tops = manager.getTopStudents(3);
  if (!tops || tops.length === 0) {
    console.log('Belum ada data siswa.');
    return;
  }
  tops.forEach((s, idx) => {
    console.log(`\n#${idx + 1}`);
    if (typeof s.displayInfo === 'function') s.displayInfo(); else console.log(s);
  });
}

/**
 * Main program loop
 * TODO: Implementasikan main loop
 * - Tampilkan menu
 * - Baca input pilihan
 * - Panggil handler yang sesuai
 * - Ulangi sampai user pilih keluar
 */
function main() {
  console.log('Selamat datang di Sistem Manajemen Nilai Siswa!');
  
  // TODO: Implementasikan loop utama program
  let running = true;

  while (running) {
    displayMenu();
    const choice = readlineSync.question('Pilih menu (1-8): ');
    switch (choice) {
      case '1':
        addNewStudent();
        break;
      case '2':
        viewAllStudents();
        break;
      case '3':
        searchStudent();
        break;
      case '4':
        updateStudent();
        break;
      case '5':
        deleteStudent();
        break;
      case '6':
        addGradeToStudent();
        break;
      case '7':
        viewTopStudents();
        break;
      case '8':
        running = false;
        break;
      default:
        console.log('Pilihan tidak valid. Silakan pilih angka 1-8.');
    }
  }
  
  console.log('\nTerima kasih telah menggunakan aplikasi ini!');
}

// Jalankan aplikasi
main();
