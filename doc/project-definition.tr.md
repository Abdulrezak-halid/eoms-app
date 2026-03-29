# MERSİN ÜNİVERSİTESİ
## ERDEMLİ UTİYO
### BİLİŞİM SİSTEMLERİ VE TEKNOLOJİLERİ

# BİTİRME PROJESİ ARA RAPORU

---

## Proje Adı
**Enterprise Operations Managements System (EOMS)**

---

## 1. Giriş
Bu ara rapor, Enterprise Operations Managements System (EOMS) projesinin mevcut durumunu, çözmeyi hedeflediği problemi, kullanılan teknolojileri ve sistemde yer alacak modülleri açıklamak amacıyla hazırlanmıştır. Proje, kurumsal operasyon süreçlerini tek bir platformda yönetilebilir, izlenebilir ve ölçeklenebilir hale getirmeyi hedeflemektedir.

## 2. Problem Tanımı
Kurumsal yapılarda kullanıcı yönetimi, rol yetkilendirme, görev takibi ve iş talebi yönetimi çoğu zaman farklı araçlar üzerinden yürütülmektedir. Bu da aşağıdaki sorunlara neden olmaktadır:

- Bilgi dağınıklığı ve veri tekrarları
- Yetkilendirme hataları ve güvenlik riskleri
- Süreçlerin izlenmesinde zorluk
- Operasyonel verimliliğin düşmesi

EOMS projesi, bu sorunları merkezi bir sistemle çözerek süreçleri standartlaştırmayı ve yönetim kalitesini artırmayı amaçlamaktadır.

## 3. Projenin Amacı
Projenin temel amacı, işletmelerdeki operasyon yönetimi süreçlerini modern web teknolojileriyle dijitalleştiren bir kurumsal yönetim platformu geliştirmektir. Sistem sayesinde:

- Kullanıcı ve rol yönetimi güvenli şekilde yapılabilecek,
- İş talepleri ve görevler takip edilebilecek,
- Yetki bazlı ekran/işlem kontrolü sağlanabilecek,
- Süreçler daha şeffaf ve ölçülebilir hale gelecektir.

## 4. Kullanılan Teknolojiler ve Araçlar
Proje, monorepo mimarisi üzerinde backend, frontend ve ortak tip üretimi yaklaşımıyla geliştirilmektedir.

### 4.1 Backend
- **Hono**: Hafif ve hızlı API çatısı
- **Zod + @hono/zod-openapi**: Doğrulama ve OpenAPI uyumlu şema üretimi
- **TypeScript**: Tip güvenliği ve sürdürülebilir kod yapısı
- **Modüler mimari**: Auth, Users, Roles gibi ayrık modül yapısı

### 4.2 Frontend
- **React + Vite**: Hızlı ve modern kullanıcı arayüzü geliştirme
- **Material UI**: Kurumsal düzeyde bileşen tabanlı arayüz tasarımı
- **TypeScript**: Bileşenler arası güvenli veri modeli kullanımı

### 4.3 Ortak Katman (Common)
- **OpenAPI JSON üretimi**: Backend sözleşmesinin dışa aktarılması
- **API schema üretimi**: Frontend için otomatik TypeScript tipleri
- **openapi-fetch**: Tip güvenli istemci çağrıları

## 5. Sistem Modülleri
Ara rapor aşamasında planlanan ve kısmen temeli atılan modüller aşağıdaki gibidir:

### 5.1 Kimlik Doğrulama ve Yetkilendirme (Auth)
- Kullanıcı giriş işlemleri
- Kimlik doğrulama altyapısı
- Oturum ve erişim kontrol mekanizması

### 5.2 Kullanıcı Yönetimi (Users)
- Kullanıcı listeleme
- Kullanıcı ekleme/güncelleme
- Kullanıcı bilgilerinin yönetimi

### 5.3 Rol Yönetimi (Roles)
- Rol tanımlama
- Rol bazlı erişim kontrolü
- Yetkilerin rol düzeyinde atanması

### 5.4 Görev Yönetimi (Tasks) - Planlanan
- Görev oluşturma ve atama
- Durum takibi (beklemede, devam ediyor, tamamlandı)
- Kullanıcı bazlı görev görünümü

### 5.5 Talep Yönetimi (Requests) - Planlanan
- Operasyonel taleplerin açılması
- Talep önceliklendirme
- Talep yaşam döngüsünün izlenmesi

### 5.6 Yönetim Paneli (Dashboard) - Planlanan
- Operasyonel özet göstergeler
- Modül bazlı durum raporları
- Yöneticiye yönelik hızlı görünüm ekranları

## 6. Ara Rapor Dönemi Çalışma Durumu
Mevcut aşamada proje altyapısı başarıyla kurulmuş ve sprint bazlı geliştirme için uygun hale getirilmiştir. Yapılan başlıca çalışmalar:

- Monorepo yapılandırması tamamlanmıştır.
- Backend tarafında auth, users ve roles modül kökleri oluşturulmuştur.
- Frontend tarafında temel sayfalar ve modül klasörleri hazırlanmıştır.
- OpenAPI tabanlı backend-frontend sözleşme akışı kurulmuştur.
- Paket bazlı build ve geliştirme komutları doğrulanmıştır.

## 7. Sonraki Aşama Planı
Bir sonraki süreçte aşağıdaki adımlar hedeflenmektedir:

- Auth akışının genişletilmesi (token/oturum yönetimi)
- Users ve Roles modüllerinin iş kurallarıyla tamamlanması
- Tasks ve Requests modüllerinin aktif geliştirilmesi
- Dashboard ekranının metriklerle zenginleştirilmesi
- Test ve dokümantasyon kapsamının artırılması

## 8. Sonuç
EOMS projesi, kurumsal operasyon süreçlerinde dağınık yapıyı ortadan kaldırarak merkezi, güvenli ve sürdürülebilir bir yönetim sistemi sunmayı hedeflemektedir. Ara rapor döneminde proje altyapısı ve çekirdek modüller için sağlam bir temel oluşturulmuştur. Sonraki aşamalarda fonksiyonel kapsam genişletilerek sistemin üretim seviyesine taşınması planlanmaktadır.

---

**Hazırlayan:** ........................................

**Öğrenci No:** ........................................

**Danışman:** ........................................

**Tarih:** Mart 2026
