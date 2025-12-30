# Tiến độ Refactoring - Giai đoạn 1

## ✅ Đã hoàn thành

### Task 1.1: Project Structure Setup
- ✅ Tạo cấu trúc thư mục: `src/components/common`, `src/components/layout`, `src/pages`, `src/types`, `src/data`, `src/context`
- ✅ Di chuyển `types.ts` → `src/types/index.ts`
- ✅ Di chuyển `constants.tsx` → `src/data/constants.tsx`
- ✅ Sửa import path trong `constants.tsx`

### Task 1.2: Refactor UI Components (Đang tiến hành)
- ✅ Tạo `src/components/common/TrailCard.tsx` với interface `TrailCardProps`
- ✅ Tạo `src/components/layout/Header.tsx` với interface `HeaderProps`
- ✅ Tạo `src/types/view.ts` cho View type definitions

### Task 1.3: Refactor Pages (Group A) (Đang tiến hành)
- ✅ Tạo `src/pages/Home.tsx`
- ✅ Tạo `src/pages/Discover.tsx`
- ⏳ Cần tạo `src/pages/TrailDetail.tsx`

## ⏳ Đang thực hiện

### Task 1.4: Refactor Pages (Group B)
- ⏳ Cần tạo `src/pages/Planner.tsx`
- ⏳ Cần tạo `src/pages/Community.tsx`
- ⏳ Cần tạo `src/pages/Profile.tsx`

### Task 1.5: Service Layer Implementation
- ⏳ Cần tạo `src/services/trailService.ts` với hàm `getTrails()`

### Task 1.6: Global State (AuthContext)
- ⏳ Cần tạo `src/context/AuthContext.tsx`
- ⏳ Cần bọc `<AuthProvider>` trong `main.tsx`

## 📝 Lưu ý

1. **Import paths**: Cần kiểm tra lại tất cả các import paths sau khi di chuyển files
2. **Constants exports**: Cần đảm bảo tất cả icons và mock data được export từ `src/data/constants.tsx`
3. **App.tsx**: Sau khi tách hết components và pages, cần cập nhật `App.tsx` để import từ các file mới

## 🔧 Cần sửa

1. Sửa import paths trong các component đã tạo
2. Hoàn thiện TrailDetail page component
3. Tạo các page components còn lại (Planner, Community, Profile)
4. Tạo service layer
5. Tạo AuthContext
6. Cập nhật App.tsx để sử dụng các components và pages mới

