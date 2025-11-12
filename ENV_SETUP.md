# Hướng dẫn cấu hình biến môi trường

## 1. Tạo file .env.local (cho localhost)

Tạo file `.env.local` trong thư mục gốc của project với nội dung:

```
MYSQL_HOST=babysitter.cho7ncckuuwv.ap-southeast-1.rds.amazonaws.com
MYSQL_PORT=3306
MYSQL_DATABASE=babysitter_dev
MYSQL_USER=admin
MYSQL_PASSWORD=babysitter123
MYSQL_ROOT_PASSWORD=babysitter123
```

## 2. Cấu hình trên Vercel

1. Vào project trên Vercel
2. Settings → Environment Variables
3. Thêm các biến sau:
   - `MYSQL_HOST` = `babysitter.cho7ncckuuwv.ap-southeast-1.rds.amazonaws.com`
   - `MYSQL_PORT` = `3306`
   - `MYSQL_DATABASE` = `babysitter_dev`
   - `MYSQL_USER` = `admin`
   - `MYSQL_PASSWORD` = `babysitter123`
   - `MYSQL_ROOT_PASSWORD` = `babysitter123`
4. Chọn môi trường: Production, Preview, Development (hoặc tất cả)
5. Save
6. **Quan trọng:** Redeploy lại project để áp dụng thay đổi

## 3. Kiểm tra

Sau khi cấu hình, restart dev server (nếu local) hoặc redeploy (nếu Vercel).

