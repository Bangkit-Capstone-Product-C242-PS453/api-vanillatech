CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NULL,
    address TEXT NULL,
    phone VARCHAR(50) NULL,
    email VARCHAR(255) UNIQUE,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE refresh_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_user INT,
    refresh_token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_user INT NULL,
    image TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE diseases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    symptoms JSON NULL,
    prevention JSON NULL
);

CREATE TABLE diseases_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_record INT,
    id_disease INT,
    FOREIGN KEY (id_record) REFERENCES records(id) ON DELETE CASCADE,
    FOREIGN KEY (id_disease) REFERENCES diseases(id) ON DELETE CASCADE
);

INSERT INTO diseases (name, symptoms, prevention) VALUES
('Akar Busuk (Root Rot)', 
    JSON_ARRAY(
        'Daun tanaman menjadi kuning, layu, dan rontok',
        'Tanaman menjadi kerdil dan pertumbuhannya terhenti',
        'Akar menjadi coklat, lembek, dan membusuk',
        'Biasanya disebabkan oleh jamur patogen seperti Fusarium sp. atau Pythium sp. yang menyerang akar'
    ), 
    JSON_ARRAY(
        'Jaga kelembapan tanah agar tidak terlalu basah, terutama di daerah yang memiliki drainase buruk',
        'Gunakan fungisida sistemik yang mengandung bahan aktif seperti metalaksil atau fosetil-aluminium',
        'Pastikan sanitasi lahan baik, serta hindari genangan air di sekitar tanaman',
        'Lakukan pergiliran tanaman dan gunakan bibit yang sehat'
    )
),
('Busuk Batang (Stem Rot)', 
    JSON_ARRAY(
        'Batang mulai mengalami pembusukan dari pangkal dan meluas ke seluruh bagian tanaman',
        'Batang berubah warna menjadi coklat kehitaman dan berbau tidak sedap',
        'Tanaman menjadi layu dan akhirnya mati',
        'Disebabkan oleh jamur Fusarium oxysporum atau Phytophthora sp.'
    ), 
    JSON_ARRAY(
        'Potong dan musnahkan bagian tanaman yang terinfeksi',
        'Tingkatkan aerasi tanah dan hindari kelembapan yang berlebihan',
        'Terapkan fungisida yang efektif seperti fosetil-aluminium dan metalaksil',
        'Gunakan metode perbanyakan tanaman dari bagian yang sehat'
    )
),
('Busuk Daun (Leaf Rot)', 
    JSON_ARRAY(
        'Terdapat bercak-bercak coklat atau hitam pada daun yang bisa meluas dan menyebabkan daun membusuk',
        'Daun mulai mengering dan rontok',
        'Penyebab umum adalah Colletotrichum sp. atau Phytophthora sp.'
    ), 
    JSON_ARRAY(
        'Pangkas daun yang terinfeksi dan bakar untuk mencegah penyebaran',
        'Gunakan fungisida berbahan aktif seperti tembaga oksiklorida atau mankozeb',
        'Jaga kebersihan lahan, pastikan tanaman mendapatkan sirkulasi udara yang baik'
    )
),
('Hawar Daun dan Bunga (Leaf and Flower Blight)', 
    JSON_ARRAY(
        'Muncul bercak-bercak coklat atau abu-abu pada daun, bunga, dan buah',
        'Bunga atau buah muda akan gugur sebelum matang',
        'Bercak tersebut dapat meluas hingga menyebabkan seluruh daun atau bunga membusuk',
        'Biasanya disebabkan oleh jamur Phytophthora sp. atau Colletotrichum sp.'
    ), 
    JSON_ARRAY(
        'Lakukan sanitasi kebun secara rutin, terutama membuang bagian tanaman yang terinfeksi',
        'Terapkan fungisida preventif seperti mankozeb atau tembaga hidroksida',
        'Jaga kebersihan lingkungan kebun dan pastikan sirkulasi udara baik'
    )
),
('Karat Daun (Leaf Rust)', 
    JSON_ARRAY(
        'Daun menunjukkan adanya bercak kuning atau oranye pada permukaan bawah daun',
        'Bercak ini seringkali berkembang menjadi pustula yang berisi spora jamur',
        'Pada infeksi berat, daun menjadi kuning dan gugur',
        'Penyebab utamanya adalah jamur Hemileia vastatrix'
    ), 
    JSON_ARRAY(
        'Pangkas dan bakar daun yang terinfeksi untuk mencegah penyebaran lebih lanjut',
        'Terapkan fungisida berbahan aktif seperti sulfur atau tembaga oksiklorida',
        'Gunakan varietas vanili yang tahan terhadap penyakit karat daun jika tersedia'
    )
),
('Powdery Mildew (Embun Tepung)', 
    JSON_ARRAY(
        'Muncul lapisan putih atau abu-abu keputihan yang mirip bedak di permukaan daun',
        'Daun yang terkena infeksi bisa menjadi keriting, kering, dan rontok',
        'Jika dibiarkan, dapat menghambat pertumbuhan tanaman secara signifikan',
        'Disebabkan oleh jamur Oidium sp. atau Erysiphe sp.'
    ), 
    JSON_ARRAY(
        'Potong dan buang daun yang terinfeksi',
        'Gunakan fungisida seperti sulfur atau fungisida berbasis minyak neem yang ramah lingkungan',
        'Jaga kebersihan tanaman dan hindari kelembapan yang berlebihan di sekitar tanaman'
    )
);
