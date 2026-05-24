HƯỚNG DẪN CÀI ĐẶT VÀ SỬ DỤNG PROJECT PHIẾU ĐIỀN ĐÁP ÁN THPTQG 2026
========================================================================

1. Cấu trúc thư mục:
   - index.html: Trang giao diện chính cho học sinh làm bài.
   - css/style.css: Tệp quản lý giao diện, giao diện bong bóng tròn (bubble).
   - js/app.js: File xử lý logic chấm điểm tự động và đóng/mở hiển thị lời giải chi tiết.
   - data/: Thư mục chứa đáp án riêng cho từng đề dưới dạng file script JavaScript (.js).
   - images/: Thư mục để thầy/cô chứa các file ảnh lời giải câu hỏi (ví dụ: `.png`, `.jpg`).
   - videos/: Thư mục để thầy/cô chứa các file video hướng dẫn giải (ví dụ: `.mp4`).

2. Cách hoạt động linh hoạt (Bỏ qua rào cản CORS):
   - Đáp án không bị lưu cứng trong index.html, khi học sinh chọn Mã Đề nào trong ô chọn, hệ thống sẽ tự động gọi file dữ liệu `data/tên_đề.js` của đề đó vào nạp.
   - Do sử dụng giải pháp nhúng thẻ Script động, project này chạy offline hoàn hảo khi click đúp chuột mở trực tiếp trên máy tính mà KHÔNG bị lỗi bảo mật chặn Fetch dữ liệu (CORS) như file JSON thông thường, đồng thời tải lên Netlify hay Web Server vẫn chạy mượt mà.

3. Cách thêm hình ảnh hoặc video vào lời giải chi tiết:
   - Bước 1: Copy file ảnh vào thư mục `images/` hoặc file video vào thư mục `videos/`.
   - Bước 2: Mở file đáp án tương ứng (ví dụ: `data/de001.js`), tìm đến câu hỏi muốn thêm.
   - Bước 3: Điền tên file tương ứng vào trường "image" hoặc "video".
     Ví dụ:
     { "id": 1, "ans": "A", "exp": "Lời giải...", "image": "images/cau1.png", "video": "" }
     hoặc:
     { "id": 2, "ans": "B", "exp": "Lời giải...", "image": "", "video": "videos/video_cau2.mp4" }

4. Cách tạo thêm đề mới (Ví dụ tạo Đề số 003):
   - Bước 1: Sao chép tệp `data/de001.js` và đổi tên thành `de003.js`.
   - Bước 2: Mở `data/de003.js` lên sửa đổi tên đề, đáp án ("ans"), lời giải ("exp") cho khớp. Hãy nhớ đổi dòng đầu tiên thành examAnswers["de003"].
   - Bước 3: Mở file `index.html`, tìm đến thẻ `<select id="exam-select">` ở gần trên cùng và thêm dòng:
     <option value="de003">Đề Số 003</option>

Chúc thầy/cô và các em học sinh có trải nghiệm ôn luyện hiệu quả nhất!
