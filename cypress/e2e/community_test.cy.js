describe('Test 4: Community Post Flow', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
      // Đăng nhập trước
      cy.get('input[type="email"]').type('testuser@gmail.com');
      cy.get('input[type="password"]').type('123456');
      cy.get('button[type="submit"]').click();
    });
  
    it('Tạo bài viết mới và sau đó xóa nó', () => {
      // Tạo một nội dung ngẫu nhiên để không bị trùng
      const noi_dung_test = 'Hello Cypress ' + Date.now();
  
      // 1. Vào trang Community
      cy.contains('Community').click();
  
      // 2. KHÔNG CẦN BẤM NÚT "CREATE" NỮA (VÌ CÓ KHUNG NHẬP LUÔN RỒI)
      
      // 3. Nhập nội dung vào ô textarea (Cái ô "What's on your mind?")
      cy.get('textarea').type(noi_dung_test);
  
      // 4. Bấm nút Post (Nút màu xanh lá trong hình)
      cy.contains('button', 'Post').click();
  
      // 5. VERIFY: Kiểm tra xem bài viết vừa đăng có hiện ra không
      // (Robot sẽ chờ mặc định 4s để bài viết hiện lên)
      cy.contains(noi_dung_test).should('be.visible');
  
      // 6. DELETE: Xóa bài vừa đăng (Để dọn rác)
      // Tìm bài viết có nội dung đó, tìm nút Delete/Xóa gần đó và bấm
      // (LƯU Ý: Nếu giao diện bạn dùng icon thùng rác thay vì chữ Delete thì bảo tui sửa lại)
      cy.contains(noi_dung_test).parent().find('button').contains('Delete').click();
    });
  });