# Hướng dẫn cấu hình biến môi trường trên Vercel

## Bước 1: Vào Vercel Dashboard

1. Truy cập [vercel.com](https://vercel.com) và đăng nhập
2. Chọn project **my-nextjs-export-api** (hoặc tên project của bạn)

## Bước 2: Cấu hình Environment Variables

1. Click vào tab **Settings** (ở thanh menu trên)
2. Click vào **Environment Variables** (ở menu bên trái)
3. Thêm từng biến môi trường sau:

### Thêm các biến:

Click nút **Add New** và thêm từng biến:

| Key | Value | Environment |
|-----|-------|-------------|
| `MYSQL_HOST` | `babysitter.cho7ncckuuwv.ap-southeast-1.rds.amazonaws.com` | Production, Preview, Development |
| `MYSQL_PORT` | `3306` | Production, Preview, Development |
| `MYSQL_DATABASE` | `babysitter_dev` | Production, Preview, Development |
| `MYSQL_USER` | `admin` | Production, Preview, Development |
| `MYSQL_PASSWORD` | `babysitter123` | Production, Preview, Development |
| `MYSQL_ROOT_PASSWORD` | `babysitter123` | Production, Preview, Development |

**Lưu ý quan trọng:**
- ✅ Chọn **tất cả 3 môi trường**: Production, Preview, Development
- ✅ Sau khi thêm mỗi biến, click **Save**

## Bước 3: Redeploy (QUAN TRỌNG!)

Sau khi thêm tất cả biến môi trường:

1. Vào tab **Deployments**
2. Tìm deployment mới nhất
3. Click vào menu **...** (3 chấm) bên phải
4. Chọn **Redeploy**
5. Hoặc đơn giản hơn: **Push một commit mới** lên GitHub (nếu có auto-deploy)

## Bước 4: Kiểm tra

1. Sau khi redeploy xong, vào tab **Logs**
2. Test lại API endpoint `/api/export-to-excel`
3. Kiểm tra logs xem còn lỗi `Missing required environment variable` không

## Troubleshooting

### Nếu vẫn lỗi sau khi redeploy:

1. **Kiểm tra lại tên biến:** Đảm bảo tên chính xác (case-sensitive)
2. **Kiểm tra giá trị:** Không có khoảng trắng thừa ở đầu/cuối
3. **Kiểm tra môi trường:** Đảm bảo đã chọn đúng môi trường (Production/Preview/Development)
4. **Xóa và thêm lại:** Đôi khi cần xóa biến cũ và thêm lại

### Kiểm tra nhanh:

Vào **Settings → Environment Variables**, bạn sẽ thấy danh sách:
- ✅ `MYSQL_HOST` ✓
- ✅ `MYSQL_PORT` ✓
- ✅ `MYSQL_DATABASE` ✓
- ✅ `MYSQL_USER` ✓
- ✅ `MYSQL_PASSWORD` ✓
- ✅ `MYSQL_ROOT_PASSWORD` ✓

Nếu thiếu bất kỳ biến nào, thêm lại và **Redeploy**.

