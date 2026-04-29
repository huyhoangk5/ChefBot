# 🍳 ChefBot – Ứng dụng gợi ý món ăn thông minh

ChefBot giúp bạn quản lý nguyên liệu, đề xuất món nấu tại nhà và gợi ý địa điểm ăn ngoài dựa trên sở thích, tích điểm và yêu thích.

🔗 **Trải nghiệm ngay:** [https://huyhoangk5.github.io/ChefBot/](https://huyhoangk5.github.io/ChefBot/)

## ✨ Tính năng chính

- 📦 **Pantry thông minh** – Chọn nguyên liệu có sẵn theo danh mục động (thêm loại mới).
- 🍽️ **Đề xuất món nấu tại nhà** – Lọc theo nguyên liệu, số người ăn, độ khớp, yêu thích hoặc nhiều điểm.
- 🚗 **Đi ăn ngoài** – Danh mục món ăn (chay, mặn, khô, nước, ngọt), tích điểm và yêu thích.
- 🎮 **Gamification** – Mỗi lần nấu/ăn +1 điểm. Đủ 5 điểm tự động thêm vào món tủ.
- 📘 **Sổ tay cá nhân** – Tạo, sửa, xóa công thức, upload ảnh, thêm nguyên liệu mới.
- 🛒 **Giỏ hàng thông minh** – Tự động thêm nguyên liệu còn thiếu khi nấu.
- 🔍 **Tìm kiếm nhanh** – Cả món ăn và nguyên liệu (kể cả món ngoài).
- 📱 **PWA** – Cài đặt lên màn hình điện thoại, hoạt động offline cơ bản.
- 💾 **Lưu trữ local** – Dữ liệu cá nhân lưu trên trình duyệt (không cần đăng nhập).

## 🛠 Công nghệ sử dụng

- **Frontend:** React 19, Vite 5, Tailwind CSS, Framer Motion
- **Icons:** Lucide React
- **PWA:** Workbox (vite-plugin-pwa)
- **Lưu trữ:** LocalStorage
- **Triển khai:** GitHub Pages

## 🚀 Hướng dẫn cài đặt & chạy local

```bash
git clone https://github.com/huyhoangk5/ChefBot.git
cd ChefBot
npm install
npm run dev

Truy cập http://localhost:5173

📦 Build và triển khai
bash
npm run build     # tạo thư mục dist
npm run deploy    # đẩy lên GitHub Pages (branch gh-pages)