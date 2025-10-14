# Auto Garage FE

Auto Garage FE là dự án frontend quản lý gara ô tô, sử dụng Angular, TailwindCSS, Transloco, và các thư viện hiện đại khác.

## Mục lục
- [Giới thiệu](#giới-thiệu)
- [Tính năng chính](#tính-năng-chính)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Cài đặt & Chạy dự án](#cài-đặt--chạy-dự-án)
- [Cấu hình môi trường](#cấu-hình-môi-trường)
- [Các lệnh thường dùng](#các-lệnh-thường-dùng)
- [Đóng góp](#đóng-góp)

---

## Giới thiệu
Dự án này cung cấp giao diện quản lý gara ô tô, bao gồm quản lý khách hàng, xe, đơn hàng, phụ tùng, người dùng, phân quyền, báo cáo, v.v.

## Tính năng chính
- Đăng nhập, phân quyền người dùng
- Quản lý khách hàng, xe, đơn hàng, phụ tùng
- Quản lý nhân viên, vai trò, trạng thái hoạt động
- Tìm kiếm, lọc, phân trang dữ liệu
- Đa ngôn ngữ (Transloco)
- Responsive UI với TailwindCSS
- Tích hợp API backend

## Cấu trúc thư mục
```
├── src/
│   ├── app/
│   │   ├── _models/         # Định nghĩa các model dữ liệu
│   │   ├── _services/       # Các service gọi API
│   │   ├── core/            # Module core, interceptor, guard
│   │   ├── modules/         # Các module tính năng
│   │   ├── shared/          # Component, pipe, directive dùng chung
│   │   ├── assets/          # Ảnh, icon, font, i18n
│   ├── environments/        # File cấu hình môi trường
│   ├── styles/              # SCSS, Tailwind
├── angular.json             # Cấu hình Angular
├── package.json             # Thông tin package, script
├── tailwind.config.js       # Cấu hình TailwindCSS
```

## Cài đặt & Chạy dự án
1. **Clone repo:**
   ```bash
   git clone https://github.com/taidtxemmex/auto-garage-fe.git
   cd auto-garage-fe
   ```
2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```
3. **Chạy dev server:**
   ```bash
   npm start
   # hoặc
   ng serve
   ```
4. **Truy cập:**
   Mở trình duyệt tại `http://localhost:4200`
