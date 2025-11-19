/**
 * Class Student
 * Representasi dari seorang siswa dengan data dan nilai-nilainya
 * 
 * TODO: Implementasikan class Student dengan:
 * - Constructor untuk inisialisasi properti (id, name, class, grades)
 * - Method addGrade(subject, score) untuk menambah nilai mata pelajaran
 * - Method getAverage() untuk menghitung rata-rata nilai
 * - Method getGradeStatus() untuk menentukan status Lulus/Tidak Lulus
 * - Method displayInfo() untuk menampilkan informasi siswa
 * 
 * Kriteria Lulus: rata-rata >= 75
 */

class Student {
  // TODO: Implementasikan constructor
  // Properti yang dibutuhkan:
  // - id: ID unik siswa
  // - name: Nama siswa
  // - class: Kelas siswa
  // - grades: Object untuk menyimpan nilai {subject: score}
  
  constructor(id, name, studentClass) {
    if (id === undefined || id === null || id === '') {
      throw new Error('ID siswa harus diisi');
    }

    if (!name || String(name).trim() === '') {
      throw new Error('Nama siswa tidak boleh kosong');
    }

    this.id = id;
    this.name = String(name).trim();
    // gunakan properti bernama `class` sesuai spesifikasi README
    this.class = studentClass || '';
    this.grades = {};
  }

  /**
   * Menambah atau update nilai mata pelajaran
   * @param {string} subject - Nama mata pelajaran
   * @param {number} score - Nilai (0-100)
   * TODO: Validasi bahwa score harus antara 0-100
   */
  addGrade(subject, score) {
    if (!subject || String(subject).trim() === '') {
      throw new Error('Nama mata pelajaran tidak boleh kosong');
    }

    const s = Number(score);
    if (Number.isNaN(s) || s < 0 || s > 100) {
      throw new Error('Nilai harus berupa angka antara 0 dan 100');
    }

    this.grades[String(subject).trim()] = s;
    return true;
  }

  /**
   * Menghitung rata-rata nilai dari semua mata pelajaran
   * @returns {number} Rata-rata nilai
   * TODO: Hitung total nilai dibagi jumlah mata pelajaran
   */
  getAverage() {
    const subjects = Object.keys(this.grades);
    if (subjects.length === 0) return 0;

    const total = subjects.reduce((sum, subj) => sum + Number(this.grades[subj] || 0), 0);
    const avg = total / subjects.length;
    return parseFloat(avg.toFixed(2));
  }

  /**
   * Menentukan status kelulusan siswa
   * @returns {string} "Lulus" atau "Tidak Lulus"
   * TODO: Return "Lulus" jika rata-rata >= 75, selain itu "Tidak Lulus"
   */
  getGradeStatus() {
    const avg = this.getAverage();
    return avg >= 75 ? 'Lulus' : 'Tidak Lulus';
  }

  /**
   * Menampilkan informasi lengkap siswa
   * TODO: Tampilkan ID, Nama, Kelas, semua nilai, rata-rata, dan status
   */
  displayInfo() {
    console.log(`ID: ${this.id}`);
    console.log(`Nama: ${this.name}`);
    console.log(`Kelas: ${this.class}`);
    console.log('Mata Pelajaran:');
    const subjects = Object.keys(this.grades);
    if (subjects.length === 0) {
      console.log('  - (belum ada nilai)');
    } else {
      subjects.forEach((subj) => {
        console.log(`  - ${subj}: ${this.grades[subj]}`);
      });
    }
    const avg = this.getAverage();
    console.log(`Rata-rata: ${avg.toFixed(2)}`);
    console.log(`Status: ${this.getGradeStatus()}`);
    console.log('------------------------');
  }
}

export default Student;
